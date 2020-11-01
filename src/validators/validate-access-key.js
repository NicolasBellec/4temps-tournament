// @flow
export default function validateAccessKey(accessKey: ?string): boolean {
  return accessKey != null && accessKey.length === 10;
}
