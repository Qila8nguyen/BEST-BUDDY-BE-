import { v4 as uuid } from 'uuid'

export namespace StringUtils {
  /**
   * It takes a string, capitalizes the first letter, lowercase's the rest of the string, and replaces underscores and
   * dashes with spaces
   * @param {string} string - string - The string to capitalize.
   * @returns A string with the first letter capitalized and the rest lowercase.
   */
  export function capitalizeFirstLetter(string: string) {
    return (
      string.charAt(0).toUpperCase() + string.toLowerCase().slice(1)
    ).replace(/[_]|[-]/g, ' ')
  }

  export const makeUuid = (): string => {
    return uuid()
  }
}
