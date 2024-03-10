// https://github.com/genshindev/api

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://genshin.jmp.blue/characters/";

let selectedCharIndex = "";
let characterDetails = [];
let selectedCharacterDetails = [];
let charList = [];
let guessCount = 0;
let matches = {};
let urlname = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        guessCount = 0;
        matches = {};
        urlname = [];
        charList = [];

        const response = await axios.get(API_URL);
        response.data.forEach((character) => {
            if (!(character.includes("traveler"))) {
                charList.push(character);
            }
        });

        selectedCharIndex = Math.floor(Math.random() * charList.length);
        selectedCharacterDetails = await axios.get(API_URL + charList[selectedCharIndex]);

        res.render("index.ejs", { charlist: charList, match: false });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

app.post("/guess", async (req, res) => {
    characterDetails = await axios.get(API_URL + charList[req.body.index]);
    urlname.push(charList[req.body.index]);

    matches[guessCount] = {
        vision: characterDetails.data.vision,
        visionMatch: false,
        weapon: characterDetails.data.weapon,
        weaponMatch: false,
        gender: characterDetails.data.gender,
        genderMatch: false,
        nation: characterDetails.data.nation,
        nationMatch: false,
        name: characterDetails.data.name,
        nameMatch: false
    }

        if (characterDetails.data.vision === selectedCharacterDetails.data.vision) {
            matches[guessCount].visionMatch = true;
        }
        if (characterDetails.data.weapon === selectedCharacterDetails.data.weapon) {
            matches[guessCount].weaponMatch = true;
        }
        if (characterDetails.data.gender === selectedCharacterDetails.data.gender) {
            matches[guessCount].genderMatch = true;
        }
        if (characterDetails.data.nation === selectedCharacterDetails.data.nation) {
            matches[guessCount].nationMatch = true;
        }
        if (characterDetails.data.name === selectedCharacterDetails.data.name) {
            matches[guessCount].nameMatch = true;
        }

    res.render("index.ejs", { charlist: charList, matches: matches, urlname: urlname, match: matches[guessCount].nameMatch })
    guessCount++;
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})