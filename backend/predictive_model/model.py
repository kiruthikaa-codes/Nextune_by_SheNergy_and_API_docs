import json
import sys
from typing import Any, Dict, List

from datetime import datetime

"""Predictive maintenance model for SheNergy (enhanced heuristic version).

Reads JSON from stdin with keys:
  customer_id: str
  vin: str
  history: list[service records]
  vehicle_features: dict

Outputs JSON to stdout:
  { "recommendations": [ { "service_code": str, "priority": int, "reason": str } ] }

This version keeps everything self-contained (no external model files) but
uses a richer scoring strategy inspired by your notebook:
- mileage / odometer bands
- number of historical services and reported issues
- recency of last service / issues
- issue text (brakes, clutch, pickup/power, AC, etc.)

It produces a small set of prioritized service codes with explanations that
will look more intelligent in the UI and chat flows.
"""


def _parse_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except Exception:
        return default


def _parse_date(value: Any) -> datetime | None:
    if not value:
        return None
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%S.%fZ"):
        try:
            return datetime.strptime(str(value), fmt)
        except Exception:
            continue
    return None


def build_recommendations(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    history = payload.get("history", [])
    vehicle = payload.get("vehicle_features", {})

    mileage = vehicle.get("mileage_km") or vehicle.get("odometer", 0)
    mileage = _parse_float(mileage, 0.0)

    # Flatten textual issues and capture recency + simple seasonality from history
    issues: List[str] = []
    last_service_date: datetime | None = None
    month_counts: Dict[int, int] = {}
    for rec in history:
        for issue in rec.get("issues_reported", []):
            issues.append(str(issue).lower())
        dt = _parse_date(rec.get("service_date") or rec.get("date"))
        if dt and (last_service_date is None or dt > last_service_date):
            last_service_date = dt
        if dt:
            month_counts[dt.month] = month_counts.get(dt.month, 0) + 1

    issues_text = " ".join(issues)

    # Simple risk score inspired by the notebook correlations
    num_services = len(history)
    num_issues = len(issues)

    risk_score = 0.0

    # Mileage contribution
    if mileage >= 60000:
        risk_score += 2.0
    elif mileage >= 40000:
        risk_score += 1.5
    elif mileage >= 20000:
        risk_score += 1.0
    elif mileage >= 10000:
        risk_score += 0.5

    # Historical services (similar to Service_History)
    if num_services >= 8:
        risk_score += 1.0
    elif num_services >= 5:
        risk_score += 0.5

    # Reported issues (like Reported_Issues)
    if num_issues >= 4:
        risk_score += 1.5
    elif num_issues >= 2:
        risk_score += 1.0
    elif num_issues == 1:
        risk_score += 0.5

    # Recency: very old last service date increases risk
    if last_service_date is not None:
        days_since_service = (datetime.now(tz=last_service_date.tzinfo) - last_service_date).days
        if days_since_service >= 365:
            risk_score += 1.5
        elif days_since_service >= 180:
            risk_score += 1.0
        elif days_since_service >= 90:
            risk_score += 0.5

    # Seasonality / travel pattern: infer high-usage months from history
    peak_months: List[int] = []
    if month_counts:
        max_count = max(month_counts.values())
        # Consider months that are close to the peak as "high usage"
        peak_months = [m for m, c in month_counts.items() if c >= max_count * 0.7]

    now = datetime.now()
    if peak_months:
        # If we are in or just before a historically high-usage month, bump risk slightly
        month = now.month
        if month in peak_months:
            risk_score += 0.5
        else:
            # Check neighbours (e.g., Dec vs Jan travel, or pre-summer servicing)
            prev_month = 12 if month == 1 else month - 1
            next_month = 1 if month == 12 else month + 1
            if prev_month in peak_months or next_month in peak_months:
                risk_score += 0.25

    # Map risk_score into an urgency band (1 = most urgent)
    if risk_score >= 3.0:
        base_priority = 1
        wait_window = "within the next few days"
        urgency_label = "urgent"
        recommended_window = "0-3 days"
    elif risk_score >= 2.0:
        base_priority = 2
        wait_window = "within 2 weeks"
        urgency_label = "soon"
        recommended_window = "1-2 weeks"
    else:
        base_priority = 3
        wait_window = "within the next month"
        urgency_label = "can_wait"
        recommended_window = "within 1 month"

    recs: List[Dict[str, Any]] = []

    # Periodic service recommendation based on mileage and risk
    if mileage >= 28000:
        recs.append({
            "service_code": "PERIODIC_30K",
            "priority": base_priority,
            "urgency_label": urgency_label,
            "recommended_window": recommended_window,
            "reason": f"Odometer near or above 30,000 km in Bangalore conditions with a composite risk score of {risk_score:.1f}; periodic 30K service is recommended {wait_window}."
        })
    elif mileage >= 18000:
        recs.append({
            "service_code": "PERIODIC_20K",
            "priority": max(base_priority, 2),
            "urgency_label": urgency_label,
            "recommended_window": recommended_window,
            "reason": f"Odometer near or above 20,000 km with risk score {risk_score:.1f}; 20K periodic maintenance is advisable {wait_window}."
        })
    elif mileage >= 8000:
        recs.append({
            "service_code": "PERIODIC_10K",
            "priority": max(base_priority, 3),
            "urgency_label": urgency_label,
            "recommended_window": recommended_window,
            "reason": f"Odometer near or above 10,000 km; a basic 10K periodic service is recommended {wait_window}."
        })

    # Issue-based rules inspired by your notebook correlations
    if "brake" in issues_text or "spongy" in issues_text:
        recs.append({
            "service_code": "BRAKE_CHECK",
            "priority": 1,
            "urgency_label": "urgent",
            "recommended_window": "0-3 days",
            "reason": "User reported brake-related issues (e.g., spongy pedal or longer stopping distance); brake inspection is critical and should not be delayed."
        })

    if "pickup" in issues_text or "power" in issues_text:
        recs.append({
            "service_code": "PERIODIC_20K",
            "priority": min(base_priority + 1, 3),
            "urgency_label": urgency_label,
            "recommended_window": recommended_window,
            "reason": "Reported pickup/power drop; periodic service and inspection of filters, fluids, and ignition components is recommended."
        })

    if "clutch" in issues_text or "hard" in issues_text:
        recs.append({
            "service_code": "CLUTCH_ADJUST",
            "priority": min(base_priority + 1, 3),
            "urgency_label": urgency_label,
            "recommended_window": recommended_window,
            "reason": "Reported clutch hardness; clutch adjustment is advised considering stop-go Bangalore traffic."
        })

    # Simple AC heuristic for demo completeness
    if "ac" in issues_text or "a/c" in issues_text or "air conditioning" in issues_text or "aircon" in issues_text:
        recs.append({
            "service_code": "AC_CHECK",
            "priority": min(base_priority + 1, 3),
            "urgency_label": urgency_label,
            "recommended_window": recommended_window,
            "reason": "User reported AC cooling issues; recommend AC system inspection (refrigerant, condenser, cabin filter) before the next long drive."
        })

    # Fallback if nothing inferred
    if not recs:
        recs.append({
            "service_code": "PERIODIC_10K",
            "priority": 3,
            "urgency_label": "can_wait",
            "recommended_window": "within 1 month",
            "reason": f"Default preventive 10K service recommendation for city driving with moderate risk score {risk_score:.1f}."
        })

    # De-duplicate by service_code keeping highest priority
    best: Dict[str, Dict[str, Any]] = {}
    for r in recs:
        code = r["service_code"]
        if code not in best or r["priority"] < best[code]["priority"]:
            best[code] = r

    # Sort by priority ascending
    out = sorted(best.values(), key=lambda x: x["priority"])
    return out


def main() -> None:
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            raise ValueError("Empty stdin for predictive model")
        payload = json.loads(raw)
        recs = build_recommendations(payload)
        out = {"recommendations": recs}
        sys.stdout.write(json.dumps(out))
        sys.stdout.flush()
    except Exception as exc:  # Fail-safe output
        fallback = {
            "recommendations": [
                {
                    "service_code": "PERIODIC_10K",
                    "priority": 3,
                    "reason": f"Fallback recommendation due to model error: {exc}"
                }
            ]
        }
        sys.stdout.write(json.dumps(fallback))
        sys.stdout.flush()


if __name__ == "__main__":
    main()
