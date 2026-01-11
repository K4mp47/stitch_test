export type navState = {
  nav: {
    origin: {
      location: {
        lat: number;
        lng: number;
      };
      description: string;
    } | null;
    distance: {
      text: string;
      value: number;
    }
    destination: {
      location: {
        lat: number;
        lng: number;
      };
      description: string;
    } | null;
    travelTimeInformation: {
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
    } | null;
    isSimulationMode?: boolean;
  }
}