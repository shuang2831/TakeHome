export interface Starship {
  MGLT: number;
  cargoCapacity: number;
  consumables: string;
  costInCredits: number;
  crew: string;
  filmConnection: [Film];
  hyperdriveRating: number;
  id: string;
  length: number;
  manufacturers: [string];
  maxAtmospheringSpeed: number;
  model: string;
  name: string;
  passengers: string;
  pilotConnection: [Pilot];
}

export interface Pilot {
  name: string;
}

export interface Film {
  title: string;
}
