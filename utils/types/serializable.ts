export type SerializableKey = string | number;
export type SerializableValue =
  | unknown
  | string
  | number
  | boolean
  | undefined
  | null
  | SerializableObject;
export type SerializableObject = {
  [key: SerializableKey]: SerializableValue;
};
