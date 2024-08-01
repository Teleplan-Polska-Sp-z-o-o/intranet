enum ENotificationVariant {
  Reassigned = "reassigned",
  Assigned = "assigned",
  Completed = "completed",
  Updated = "updated",
  Checked = "checked",
  Approved = "approved",
  CheckFailed = "check failed",
  ApprovalFailed = "approval failed",

  EngineeringApproval = "engineering approval",
  QualityApproval = "quality approval",
  UpdatedCompleted = "updated completed",
  UpdatedUncompleted = "updated uncompleted",
  UpdatedEngineeringApproval = "updated engineering approval",
  UpdatedQualityApproval = "updated quality approval",
  CheckerApproval = "checker approval",
  ApproverApproval = "checker approval",
}

enum EDCNotificationVariant {
  Completed = "completed",
  Updated = "updated",
  Checked = "checked",
  Approved = "approved",
  Registered = "registered",
  Unregistered = "unregistered",
  CheckFailed = "check failed",
  ApprovalFailed = "approval failed",
  RegisterFailed = "register failed",
}

export { ENotificationVariant, EDCNotificationVariant };
