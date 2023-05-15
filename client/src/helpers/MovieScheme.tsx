interface MovieScheme {
     movies(movies: any): unknown;
     movieID: number;
     title: string;
     description: string;
     actors: string;
     releaseDate: string;
     posterUrl: string;
     featured: boolean;
     adminID: number;
   }

export default MovieScheme