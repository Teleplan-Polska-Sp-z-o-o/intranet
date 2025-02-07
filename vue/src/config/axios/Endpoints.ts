enum Endpoints {
  uploads = "/uploads",
  documentsFolder = "/documents",
  dcDocumentsFolder = "/dc_documents",

  Users = "/api/user",
  Msal = "/api/msal",

  User = "/api/user/one",
  UserAuth = "/api/user/auth",
  UserSettingsTheme = "/api/user/settings/theme",
  UserSettingsLanguage = "/api/user/settings/language",
  UserPermission = "/api/user/permission",

  // documents
  ViewDocument = "/uploads",
  Document = "/api/document",
  DocumentDepartment = "/api/document/department",
  DocumentCategory = "/api/document/category",
  DocumentSubcategory = "/api/document/subcategory",
  Competence = "/api/competence",

  /// creator

  AddDraft = "/api/document/creator/new/post",
  PutDrafts = "/api/document/creator/new/put", // /:id
  GetDrafts = "/api/document/creator/get",
  DeleteDrafts = "/api/document/creator/delete", // /:id
  GenerateDrafts = "/api/document/creator/generate", // /:id/:language

  // editor
  News = "/api/editor/news",
  Request = "/api/editor/request",

  // change
  ChangeRequest = "/api/change/request",
  ChangeNotice = "/api/change/notice",
  ChangeDocument = "/api/dc",

  //notification
  Notification = "/api/notification",

  // server config
  ServerConfig = "/api/server",

  // acknowledge
  Acknowledge = "/api/acknowledge",
  ToAcknowledge = "/api/acknowledge/to",
  UserAcknowledgement = "/api/acknowledge/user",

  // xlsx
  XLSX = "/api/xlsx",
  // app.use("/api/xlsx", xlsxRoutes); //"/read/:fileName/:fileDir/:_worksheetNameOrIndex?/:_rowCount?/:_columnCount?",

  // analytic
  AnalyticFile = "/api/analytic-file",
  Analytic = "/api/analytic",
}

export { Endpoints };
