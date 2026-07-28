from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import RequireWorkspaceRole
from app.models.workspace import WorkspaceMember
from app.models.billing import Subscription, Payment
from pydantic import BaseModel

router = APIRouter(prefix="/billing", tags=["Billing"])


class UpgradeRequest(BaseModel):
    plan_name: str

class SubscriptionResponse(BaseModel):
    id: int
    plan_name: str
    status: str

    model_config = {"from_attributes": True}

class UpgradeResponse(BaseModel):
    message: str
    subscription: SubscriptionResponse


class InvoiceResponse(BaseModel):
    id: str
    date: str
    amount: str
    status: str

    model_config = {"from_attributes": True}


@router.get("/invoices", response_model=list[InvoiceResponse])
def get_invoices(db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    payments = db.query(Payment).filter(Payment.workspace_id == current_member.workspace_id).order_by(Payment.created_at.desc()).all()
    invoices = []
    for p in payments:
        invoices.append(InvoiceResponse(
            id=f"INV-{p.created_at.year}-{p.id:03d}",
            date=p.created_at.strftime("%b %d, %Y"),
            amount=f"${p.amount:,.2f}",
            status=p.status
        ))
    return invoices

@router.get("/subscription", response_model=SubscriptionResponse)
def get_subscription(db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    sub = db.query(Subscription).filter(Subscription.workspace_id == current_member.workspace_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub


@router.post("/upgrade", response_model=UpgradeResponse)
def mock_upgrade_subscription(
    payload: UpgradeRequest,
    db: Session = Depends(get_db),
    current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))
):
    # Mock Razorpay flow for now based on user instruction
    if payload.plan_name not in ["Pro", "Enterprise"]:
        raise HTTPException(status_code=400, detail="Invalid plan name")

    sub = db.query(Subscription).filter(Subscription.workspace_id == current_member.workspace_id).first()
    if not sub:
        sub = Subscription(workspace_id=current_member.workspace_id, plan_name=payload.plan_name, status="Active")
        db.add(sub)
    else:
        sub.plan_name = payload.plan_name
        sub.status = "Active"

    # Create a mock payment for the invoice history
    amount = 49.00 if payload.plan_name == "Pro" else 99.00
    payment = Payment(workspace_id=current_member.workspace_id, amount=amount, currency="USD", status="Paid")
    db.add(payment)

    db.commit()
    db.refresh(sub)
    return {
        "message": "Subscription upgraded successfully", 
        "subscription": sub
    }
