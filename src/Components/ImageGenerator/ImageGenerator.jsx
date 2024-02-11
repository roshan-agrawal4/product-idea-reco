import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../Assets/iterate_ai_logo.svg";
import OpenAI from "openai";
//import dotenv from 'dotenv';


//dotenv.config();


const APIKey = process.env.REACT_APP_OPENAI_API_KEY;

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState("");

  const imageGenerator = async () => {
    let originalPrompt = inputRef.current.value;
    let userPrompt = inputRef.current.value;
    let defaultPrompt =
      "This is a product idea entered by a user. Returns a minimilistic logo representing any product of the given product idea.";
    // originalPrompt+=". Give a list of 3 types of this product and a 2 line description of each.";

    if (userPrompt === "") {
      return 0;
    } else {
      userPrompt += ". " + defaultPrompt;
    }
    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+APIKey,
          "User-Agent": "Chrome",
        },
        body: JSON.stringify({
          prompt: userPrompt, //`${inputRef.current.value}`,
          n: 1,
          size: "512x512",
        }),
      });
      let data = await response.json();
      let data_array = data.data;
      setImage_url(data_array[0].url);
    } catch (error) {
      console.error("Error fetching image generation:", error);
    } finally {
      setLoading(false);
    }
  };

  const textGenerator = async () => {
    // console.log("h1");
    const originalPrompt = inputRef.current.value;
    if (originalPrompt === "") return;

      try{
      const openai = new OpenAI({apiKey: APIKey, dangerouslyAllowBrowser: true});

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "Give a list of 3 types of this product and a 2 line description of each." },
                { role: "user", content: originalPrompt },
              ],
            model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);

/*
      const data = await response.json();
      const recommendations = data.choices[0].message.content;*/
      setRecommendations(completion.choices[0].message.content);
      console.log("h3", recommendations);

    } catch (error) {

        // console.log("h4");
      console.error("Error fetching text recommendations:", error);
    } 
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        Product Idea <span>generator</span>
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Write your Product idea"
        />
        <div
          className="generate-btn"
          onClick={() => {
            imageGenerator();
            textGenerator(); 
          }}
        >
          Generate
        </div>
        <div className="image-container">
          <img
            src={image_url === "/" ? default_image : image_url}
            alt=""
            className="image"
          />
        </div>
      </div>
      <div className="loading">
        <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
        <div className={loading ? "loading-text" : "display-none"}>Loading....</div>
      </div>

      <div className="recommendations">
        <div className="recommendations-box">
          <h3>Recommendations:</h3>
          <ul>
            {recommendations.split('\n').map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>





    </div>
  );
};

export default ImageGenerator;