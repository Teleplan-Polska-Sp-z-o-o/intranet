import jwtAxios from "../../../../../../../../config/axios/jwtAxios";

interface MSLanguageOption {
  code: string;
  name: string;
}
interface MSLanguage {
  name: string;
  nativeName: string;
  dir: string;
}

// Allowed language codes
const ALLOWED_LANGUAGES = new Set(["pl", "uk", "cs", "en"]);

async function fetchLanguages(includeOriginal: boolean = true): Promise<MSLanguageOption[]> {
  try {
    const response = await jwtAxios.get(
      "https://api-eur.cognitive.microsofttranslator.com/languages?api-version=3.0",
      {
        headers: {
          "Accept-Language": "en", // Force English response
        },
      }
    );

    // Parse response into [{code: "af", name: "Afrikaans"}, ...]
    const languages = Object.entries(response.data.translation as Record<string, MSLanguage>)
      .filter(([code]) => ALLOWED_LANGUAGES.has(code))
      .map(([code, details]) => ({
        code,
        name: details.name,
      }));
    if (includeOriginal)
      languages.unshift({
        code: "original",
        name: "Original",
        //   name: t(`${tBase}.original`),
      });

    return languages;
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}

function mapLanguageToFlag(code: string): string {
  const flagMap: Record<string, string> = {
    pl: "pl",
    uk: "ua", // Ukrainian language → Ukraine flag
    cs: "cz", // Czech language → Czech Republic flag
    en: "gb", // English → UK flag (or use "us" for US)
  };
  return flagMap[code] || code; // Default to the same code if not mapped
}

export { type MSLanguageOption, type MSLanguage, fetchLanguages, mapLanguageToFlag };
