import {gql} from '@apollo/client';

export const STARSHIPS = gql`
  query getStarShips {
    allStarships {
      starships {
        MGLT
        cargoCapacity
        consumables
        costInCredits
        created
        crew
        edited
        filmConnection {
          films {
            title
          }
        }
        hyperdriveRating
        id
        length
        manufacturers
        maxAtmospheringSpeed
        model
        name
        passengers
        pilotConnection {
          pilots {
            name
          }
        }
      }
      totalCount
    }
  }
`;
