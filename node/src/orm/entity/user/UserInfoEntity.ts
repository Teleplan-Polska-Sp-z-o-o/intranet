import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserInformation } from "../../../models/user/UserInformation";
import { ILdapUser } from "../../../interfaces/user/ILDAP";

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  position: string | null;

  @Column()
  department: string | null;

  @Column()
  decisionMaker: boolean | null;

  @Column()
  LDAPObject: string;

  constructor() {}

  public sanitizeAndAssignLDAPObject = (ldapUser: ILdapUser | null): UserInfo => {
    if (ldapUser === null) return null;
    const sanitizedLdapUser = { ...ldapUser };

    const replacementString = "VALUE_CANNOT_BE_STORED";

    // Function to check if a string contains only printable characters
    const containsOnlyPrintableCharacters = (str: string): boolean => {
      return /^[\x20-\x7E]*$/.test(str);
    };

    const sanitizeJSONString = (jsonString: string): string => {
      // Remove null characters
      let sanitizedString = jsonString.replace(/\\u0000/g, "");

      // Escape backslashes
      sanitizedString = sanitizedString.replace(/\\/g, "\\\\");

      // Ensure valid Unicode escapes
      sanitizedString = sanitizedString.replace(/\\u([0-9A-Fa-f]{4})/g, "\\u$1");

      return sanitizedString;
    };

    const recursiveSanitize = (obj: any): any => {
      if (obj === null || obj === undefined) {
        return obj;
      }

      if (typeof obj === "string") {
        // If the string contains non-printable characters, replace it with the replacement string
        if (!containsOnlyPrintableCharacters(obj)) {
          return replacementString;
        }
        // Otherwise, sanitize the string
        return sanitizeJSONString(obj);
      }

      if (typeof obj === "object") {
        const newObj: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = recursiveSanitize(obj[key]);
          }
        }
        return newObj;
      }

      return obj;
    };

    // const sanitizedLdapObject = recursiveSanitize(sanitizedLdapUser);
    const sanitizedLdapObject = recursiveSanitize(sanitizedLdapUser);

    this.LDAPObject = JSON.stringify(sanitizedLdapObject);
    return this;

    // '{"dn":"CN=Mariusz Rybarczyk,OU=Users,OU=Bydgoszcz,OU=Locations,OU=RECONEXT,DC=reconext,DC=com","objectClass":["top","person","organizationalPerson","user"],"cn":"Mariusz Rybarczyk","sn":"Rybarczyk","c":"PL","l":"Bydgoszcz","st":"kujawsko-pomorskie","title":"Program Director","description":"Program Director[HRID:12100093]","postalCode":"85-834","physicalDeliveryOfficeName":"Bydgoszcz - PL","telephoneNumber":"+48523646317","givenName":"Mariusz","distinguishedName":"CN=Mariusz Rybarczyk,OU=Users,OU=Bydgoszcz,OU=Locations,OU=RECONEXT,DC=reconext,DC=com","instanceType":"4","whenCreated":"20200712175511.0Z","whenChanged":"20240623162948.0Z","displayName":"Mariusz Rybarczyk","uSNCreated":"12893","memberOf":["CN=Office User Platinum plus GDPR,OU=O365,OU=Licensing,OU=RECONEXT,DC=reconext,DC=com","CN=Office Add-on Power BI Pro,OU=O365,OU=Licensing,OU=RECONEXT,DC=reconext,DC=com","CN=Recruitee-SSO,OU=Groups,OU=ADFS,OU=Services,OU=RECONEXT,DC=reconext,DC=com","CN=Elearning-Bydgoszcz-group-test,OU=eLearning,OU=Services,OU=RECONEXT,DC=reconext,DC=com","CN=BYD-Wifi-Allowed,OU=EMEA,OU=SecurityGroups,OU=DataCenterReconext,DC=reconext,DC=com","CN=RECONEXT_EMPROD_IFS_ServiceManagement_Plus_Cto,OU=Citrix,OU=Services,OU=RECONEXT,DC=reconext,DC=com","CN=BYD G Resources.ListFolderContents,OU=Groups,OU=Bydgoszcz,OU=Locations,OU=RECONEXT,DC=reconext,DC=com","CN=RECONEXT_EMPROD_IFS_FULL,OU=Citrix,OU=Services,OU=RECONEXT,DC=reconext,DC=com","CN=Bydgoszcz-VPN-Allowed,OU=Groups,OU=VPN,OU=Services,OU=RECONEXT,DC=reconext,DC=com","CN=Lucom-Authentication,OU=Lucom,OU=Services,OU=RECONEXT,DC=reconext,DC=com","CN=ESA Mobile Application Users,OU=ESET Secure Authentication,DC=reconext,DC=com","CN=MFA-Enabled,OU=MFA,OU=Services,OU=RECONEXT,DC=reconext,DC=com"],"uSNChanged":"24832856","co":"Poland","department":"Liberty Global - SKY","company":"Reconext Bydgoszcz","proxyAddresses":"smtp:Mariusz.Rybarczyk@teleplan.com","streetAddress":"Mokra 31","garbageCollPeriod":"0","name":"Mariusz Rybarczyk","objectGUID":"\x7F�I�f��N�l\\\\u000f��b�","userAccountControl":"512","badPwdCount":"0","codePage":"0","countryCode":"616","homeDirectory":"\\\\\\\\\\\\\\\\tppl02s003\\\\\\\\userfolders$\\\\\\\\Mariusz.Rybarczyk","homeDrive":"U:","badPasswordTime":"133636971556869347","lastLogoff":"0","lastLogon":"133636976721964283","logonHours":"���������������������","pwdLastSet":"133606580989316644","primaryGroupID":"513","userParameters":"m                     d\\\\u0001                        P\\\\u0007\\\\u001a\\\\b\\\\u0001CtxCfgPresent㔵攱戰ぢ\\\\u0018\\\\b\\\\u0001CtxCfgFlags1〰て〲〹\\\\u0012\\\\b\\\\u0001CtxShadow㄰〰〰〰*\\\\u0002\\\\u0001CtxMinEncryptionLevel㄰\\\\u0018b\\\\u0001CtxWFHomeDir挵挵㐵〷收挶〳ㄳ㌷㌶〳ㄳㄳ挵㠶昶搶㔶㐲挵㔴搴㔴ㄴ挵〵挴〳〳ㄳ挵搴ㄶ㈷㤶㔷㌷愷攲㈵㤷㈶ㄶ㈷㌶愷㤷戶〰\\\\"\\\\u0006\\\\u0001CtxWFHomeDirDrive㠶愳〰 b\\\\u0001CtxWFProfilePath挵挵㐵〷收挶〳ㄳ㌷㌶〳ㄳㄳ挵㠶昶搶㔶㐲挵㔴搴㔴ㄴ挵〵挴〳〳ㄳ挵搴ㄶ㈷㤶㔷㌷愷攲㈵㤷㈶ㄶ㈷㌶愷㤷戶〰","objectSid":"\\\\u0001\\\\u0005\\\\u0005\\\\u0015nC\\\\u001f�\\\\u0004\\\\u0016M��Ը��\\\\b","accountExpires":"0","logonCount":"249","sAMAccountName":"Mariusz.Rybarczyk","sAMAccountType":"805306368","sIDHistory":"\\\\u0001\\\\u0005\\\\u0005\\\\u0015]�# �.�dп��b�","userPrincipalName":"Mariusz.Rybarczyk@reconext.com","lockoutTime":"0","objectCategory":"CN=Person,CN=Schema,CN=Configuration,DC=reconext,DC=com","dSCorePropagationData":["20231103133238.0Z","20230911133239.0Z","20221228112702.0Z","20220114130312.0Z","16010714223649.0Z"],"mS-DS-ConsistencyGuid":"\x7F�I�f��N�l\\\\u000f��b�","lastLogonTimestamp":"133633367139274837","msDS-KeyCredentialLink":"B:856:000200002000019EB8FA433D879C1F48913085FB7A04A755D82118539C6FE201B0D6F1CAE9A93420000265F22413D91FAC84E5DF8B740F848E593B7CE0AD8C4F8D2EBE0DB09B733CF9F31C010352534131000800000300000001010000000000000000000001000100C050FEAE302A08F6D1439A065B9CF6258D02BD68C6521E799C1F36BAC93BF6057C69B478E2DCDB05C173EC14840AB857831BB4B6130A5351E90A0064F307ECD70E1718A0D56717460F0930235A7A1866298EF7DCAD28DE5EA86E6F2D5F538AD19DAC29C25641D105F1071D22EDDFE397EDB6E4533FA5A806D2E6F239DD941047EB48F5636F473EF46414BFB145C469DCD14843C15EAE618CFBDB846222210242545395B1AB9F44A07652D2B790ED46BD74DFFF7DEFB202A79091C70C5530571ED14F980B6A4ED0F13651CA25A460540A5841961AF93ADFCBF250B40A8B798F46783C473FF4E65B1BC490D01CCA2EC61551FAB2FA595127F9827F84D3F92074C701000401010005011000065AA8D157B1B50D48AF78FE2BFFDF2E6C0F00070100000100020000000000000000000800080000000000000000080009D51DF5295EA2D848:CN=Mariusz Rybarczyk,OU=Users,OU=Bydgoszcz,OU=Locations,OU=RECONEXT,DC=reconext,DC=com","msDS-preferredDataLocation":"EUR","mail":"Mariusz.Rybarczyk@reconext.com","manager":"CN=Dorota Lemanska,OU=Users,OU=Bydgoszcz,OU=Locations,OU=RECONEXT,DC=reconext,DC=com","mobile":"+48663891647","pager":"48663891647","esaLastSuccessfulAuthentication":"20240623162036.0Z","esaLastFailedAuthentication":"20240513193926.0Z"}',
  };

  public build = (info: UserInformation, fromLDAP: ILdapUser = null) => {
    this.position = info.position;
    this.department = info.department;
    this.decisionMaker = info.decisionMaker;
    this.sanitizeAndAssignLDAPObject(fromLDAP);

    return this;
  };
}
