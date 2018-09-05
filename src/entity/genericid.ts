export default class GenericID {
  public readonly value: number
  public readonly identifier: string

  constructor(value, identifier) {
    this.value = value;
    this.identifier = identifier;
  }
}