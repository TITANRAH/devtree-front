export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// TODO: VALIDAR URLS

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.log(error);
    return false;
  }
}
