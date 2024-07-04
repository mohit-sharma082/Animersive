import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_ANIMES = 10;


const ANIME = {
    info: {
        "id": "one-piece-100",
        "name": "One Piece",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/bcd84731a3eda4f4a306250769675065.jpg",
        "description": "Gold Roger was known as the \"Pirate King,\" the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.\n\nEnter Monkey Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy's reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.",
        stats: {
            "rating": "PG-13",
            "quality": "HD",
            episodes: {
                "sub": 1109,
                "dub": 1085
            },
            "type": "TV",
            "duration": "24m"
        }
    },
    moreInfo: {
        "japanese": "ONE PIECE",
        "synonyms": "OP",
        "aired": "Oct 20, 1999 to ?",
        "premiered": "Fall 1999",
        "duration": "24m",
        "status": "Currently Airing",
        "malscore": "8.62",
        "genres": [
            "Action",
            "Adventure",
            "Comedy",
            "Drama",
            "Fantasy",
            "Shounen",
            "Super Power"
        ],
        "studios": "Toei Animation",
        "producers": [
            "Fuji TV",
            "TAP",
            "Shueisha",
            "Toei Animation",
            "Funimation",
            "4Kids Entertainment"
        ]
    }
}


export class ExplorationUtility {
    static async saveAnime(anime) {
        try {
            if (!anime?.info?.id?.length) return;
            const storedAnimes = await AsyncStorage.getItem('explore');
            let animesArray = JSON.parse(storedAnimes) ?? [];

            const existingIndex = animesArray.findIndex(a => a.id === anime.info.id);
            if (existingIndex !== -1) {
                const animeInfo = {
                    format: anime.info?.stats?.type,
                    status: anime.moreInfo?.status,
                    episodes: (anime.info?.stats?.episodes?.sub ?? '-'),
                    duration: (anime.info?.stats?.duration === '?m') ? '-' : anime?.info?.stats?.duration,
                    startDate: (anime.moreInfo?.aired.split(' to ')[0])?.replace('?', '-'),
                    endDate: (anime.moreInfo?.aired.split(' to ')[1])?.replace('?', ''),
                    score: anime.moreInfo?.malscore?.replace('?', ''),
                };

                animesArray[existingIndex] = {
                    id: anime?.info?.id ?? '',
                    name: anime?.info?.name ?? '',
                    description: (anime?.info?.description ?? '').replace('\n\n', '\n').substring(0, 150) + '...',
                    poster: anime?.info?.poster ?? '',
                    info: animeInfo,
                };
            } else {
                const animeInfo = {
                    format: anime.info?.stats?.type,
                    status: anime.moreInfo?.status,
                    episodes: (anime.info?.stats?.episodes),
                    duration: (anime.info?.stats?.duration === '?m') ? '-' : anime?.info?.stats?.duration,
                    startDate: (anime.moreInfo?.aired.split(' to ')[0])?.replace('?', '-'),
                    endDate: (anime.moreInfo?.aired.split(' to ')[1])?.replace('?', ''),
                    score: anime.moreInfo?.malscore?.replace('?', ''),
                };

                animesArray.unshift({
                    id: anime?.info?.id ?? '',
                    description: (anime?.info?.description ?? '').replace('\n\n', '\n').substring(0, 150) + '...',
                    name: anime?.info?.name ?? '',
                    poster: anime?.info?.poster ?? '',
                    info: animeInfo,
                });

                if (animesArray.length > MAX_ANIMES) {
                    animesArray = animesArray.slice(0, MAX_ANIMES);
                }
            }

            await AsyncStorage.setItem('explore', JSON.stringify(animesArray));
            console.log('Anime saved to local storage');
        } catch (error) {
            console.error('Error saving anime to local storage', error);
        }
    };

    static async getAnimes(sub = true) {
        try {
            const storedAnimes = await AsyncStorage.getItem('explore');

            const animes = (JSON.parse(storedAnimes) ?? []).map((anime) => {
                console.log(`\nANIME =>> `, JSON.stringify(anime, 0, 4));
                if (anime.info.episodes?.sub == null && anime.info.episodes?.dub == null) anime.info.episodes = 0;
                anime.info = {
                    ...anime.info,
                    episodes: ((sub ? anime.info.episodes?.sub : anime.info.episodes?.dub) ?? anime.info.episodes) + ' Ep.',
                    startDate: 'Started - ' + (anime.info.startDate?.replace('?', '-') ?? ''),
                    duration: (anime.info.duration === '?m') ? '-' : anime.info.duration,
                };
                if (!!anime.info?.endDate?.length) {
                    anime.info.endDate = 'Ended - ' + (anime.info.endDate?.replace('?', '') ?? '')
                } else delete anime.info.endDate
                if (!!anime.info?.endDate?.length) {
                    anime.info.score = 'Score - ' + (anime.info.score?.replace('?', '') ?? '')
                } else delete anime.info.score

                return anime
            })
            return animes
        } catch (error) {
            console.error('Error retrieving animes from local storage', error);
            return [];
        }
    };
}