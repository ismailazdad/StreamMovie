import "./style.css";
import StarRatingComponent from "react-star-rating-component";
import ReactLoading from "react-loading";
import {LazyLoadImage} from "react-lazy-load-image-component";
import React, {useState} from "react";
import Sv1 from "./Sv1";
import Sv2 from "./Sv2";
import MovieTypes from "./MovieTypes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faStar,
    faDownload,
} from "@fortawesome/free-solid-svg-icons";

const fetch = require("sync-fetch");
function Watch(params) {
    const [serverUse, ChangeServer] = useState(2);
    const [isChoose, setIsChoose] = useState(false);
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const tmdbId = url.searchParams.get("tmdb_id") || 667538;
    let movieObject = {};
    movieObject.tmdb_id = tmdbId
    const userPreferredLanguage = navigator.language || navigator.userLanguage;
    let movieInfo = fetch(
        "https://api.themoviedb.org/3/movie/" +
        movieObject.tmdb_id +
        "?api_key=80d38ce4b783b1c72330ca00da8dd2d3&append_to_response=videos%2Ccredits&language="+userPreferredLanguage,
        {
            method: "GET",
            headers: {},
        }
    ).json();

    movieObject.english_title = movieInfo?.original_title
    movieObject.release_date = movieInfo?.release_date
    movieObject.runtime = movieInfo?.runtime
    movieObject.genre_ids = movieInfo?.genres?.map(e => e.id)
    movieObject.backdrop_path = movieInfo?.backdrop_path
    movieObject.imdb_id = movieInfo?.imdb_id
    movieObject.imdb = movieInfo?.vote_average
    console.log("movieInfo",movieInfo)
    let foundHash = false;
    const [modal, setModal] = useState(false);
    const [videoLoading, setVideoLoading] = useState(true);
    let torrent
    try{
        torrent = fetch(
            "https://yts.mx/api/v2/movie_details.json?imdb_id=" + movieObject.imdb_id,
            {
                method: "GET",
                headers: {},
            }
        ).json();
    }catch (error) {
        if (error.message.includes("net::ERR_CONNECTION_REFUSED")) {
            // Handle the connection refused error specifically
            console.error("Connection refused. The server might be down.");
        } else {
            // Handle other errors
            console.error("Error:", error);
        }
    }


    if(torrent?.data?.movie?.torrents){
        for (const tmp of torrent?.data?.movie?.torrents) {
            if (tmp.hasOwnProperty("hash")) {
                movieObject.hash = tmp.hash;
                foundHash = true;
                break;
            }
        }
    }
    const torurl = torrent?.data?.movie?.url
    movieObject.torrentUrl = torurl && torurl  !== "https://yts.mx/movies/" ? torurl : undefined
    const openModal = () => {
        setModal(!modal);
    };

    const spinner = () => {
        setVideoLoading(!videoLoading);
    };

    return (
        <div className="wrapcontainer">
            {movieObject && movieInfo && (
            <div className="bg-black">
                    <div className=" bg-black">
                        <LazyLoadImage
                            className="bg-cover brightness-50 blur-lg bg-black"
                            placeholder={
                                <ReactLoading type={"spin"} color="#d30000" height={'20%'} width={'20%'}/>
                            }
                            src={
                                "https://www.themoviedb.org/t/p/original" +
                                movieObject.backdrop_path
                            }
                        />
                        <div className="md:flex absolute sm:top-[5%] top-[5%]  left-[5%]">
                            <div className="md:hidden flex justify-center">
                                <LazyLoadImage
                                    className="w-[30%] md:w-[60%] rounded-md shadow-lg"
                                    placeholder={
                                        <ReactLoading
                                            type={"spinningBubbles"}
                                            height={"5em"}
                                            width={"5em"}
                                        />
                                    }
                                    src={
                                        "https://www.themoviedb.org/t/p/original" +
                                        movieInfo.poster_path
                                    }
                                />
                            </div>

                            <img
                                className="hidden md:block w-[35%] md:w-[30%] rounded-md shadow-lg"
                                src={
                                    "https://www.themoviedb.org/t/p/original" +
                                    movieInfo.poster_path
                                }
                            ></img>

                            <div className="top-[5%] ml-5 mt-2 text-white">
                                <h1 className="font-semibold md:text-4xl text-lg">
                                    {movieObject.english_title}
                                </h1>

                                <h1 className="mt-3 font-semibold md:text-base text-xs">
                                    {new Date(movieObject.release_date).getFullYear()} •{" "}
                                    {movieObject.runtime} minute •{" "}
                                    {movieObject.genre_ids.slice(0, 3).map((e) => (
                                        <>
                                            <div
                                                className="genreBubble">{MovieTypes.find((x) => x.key === e).name}</div>
                                        </>
                                    ))}
                                    <div>
                                    </div>
                                </h1>
                                <StarRatingComponent
                                    name="IMBDrate"
                                    editing={false}
                                    renderStarIcon={() => (
                                        <FontAwesomeIcon
                                            className="mr-1 shadow-lg text-xs"
                                            icon={faStar}
                                        />
                                    )}
                                    starCount={5}
                                    value={(movieObject.imdb * 5) / 10}
                                />
                                <p className="font-semibold md:text-base text-sm">
                                    IMDb: {movieObject.imdb}/10
                                </p>
                                {movieObject.torrentUrl && (
                                <p className="font-semibold md:text-base text-sm">
                                    Torrent url :
                                    <a href={movieObject.torrentUrl} target="_blank">  <FontAwesomeIcon className="ml-1 shadow-lg text-lg" icon={faDownload}/>{" "}</a>
                                </p>)}


                                {foundHash ? (
                                    <div>
                                        <h3 className="text-center text-white text-lg font-bold pt-2 pb-2">
                                            {movieObject.english_title}
                                            <p className="text-sm font-thin"></p>
                                        </h3>
                                        {serverUse === 1 ? (
                                            <Sv1 movieObject={movieObject}/>
                                        ) : (
                                            <Sv2 movieObject={movieObject}/>
                                        )}

                                        <ul>
                                            <li><span>&#9888;</span> Use Vpn, </li>
                                            <li><span>&#9888;</span> to avoid ads , use brave browser </li>
                                        </ul>
                                    </div>) : <h1 style={{color:"white"}}> no movie... or USE VPN to watch</h1>}

                            </div>

                        </div>

                    </div>

            </div>
            )}
        </div>
    );
}

export default Watch;
