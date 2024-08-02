enum HttpResponseMessage {
  POST_ERROR = "post_error",
  POST_SUCCESS = "post_success",
  PUT_ERROR = "put_error",
  PUT_SUCCESS = "put_success",
  GET_ERROR = "get_error",
  GET_SUCCESS = "get_success",
  DELETE_ERROR = "delete_error",
  DELETE_SUCCESS = "delete_success",
  UNKNOWN = "unknown",

  AUTH_INVALID_CREDENTIALS = "auth_invalid_credentials",
  DECISION_MAKER_ERROR = "decision_maker_error",
  TOOL_ACCESS_ERROR = "tool_access_error",
  REFERENCE_FORMAT_ERROR = "reference_format_error",
  REFERENCE_ALREADY_CONTAINS_ERROR = "reference_already_contains_error",
  UNAUTHORIZED = "unauthorized",
}

// enum HttpUserResponseMessage {}
// PUT_INFO_EDIT_ERROR = "put_info_edit_error",

export { HttpResponseMessage };
