export const getText = (
  $: cheerio.Root,
  isNumber: boolean = false,
  selector: string | cheerio.Element
) => {
  let result = $(selector).text().trim();
  if (isNumber) return parseInt(result);
  else return result;
};

export const getTextWithSplit = (
  $: cheerio.Root,
  isNumber: boolean = false,
  selector: string | cheerio.Element,
  splitCharacter: string,
  index: number = 0
) => {
  let result = $(selector).text().trim().split(splitCharacter)[index];
  return isNumber ? parseInt(result) : result;
};
