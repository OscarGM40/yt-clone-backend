export const SUPPORTED_LANGUAGES = ["en", "es", "it"]

// this syntax is equals to "en" | "es" | "it"
// memoriza esto(typeof const[number] es igual a "es"|"en",etc.Fijate que esto es simplemente por carpinteria,ya que los valores son un arreglo,algo muy comun,y por esto lo usamos en el project)
export type Language = typeof SUPPORTED_LANGUAGES[number]

/* export type User = {
    id: number,
    name: string,
    surname: string,
    authenticationToken : string | null
} */