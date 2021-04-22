import React, { useState, useEffect } from "react";
import { MESSAGES_API, BASE_URL } from "./api";
import "./Home.css";
import { $ } from "react-jquery-plugin";

var token_holder = "";

function Home() {
  const [messageList, setmessageList] = useState({ token: "", messages: [] });
  useEffect(() => {
    const fetchMessages = (token) => {
      let temp_api = MESSAGES_API;
      if (!token) {
        temp_api = `${MESSAGES_API}?pageToken=${token}`;
      }
      fetch(temp_api)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.messages);
          token_holder = res.pageToken;
          setmessageList((prevList) => ({
            ...prevList,
            //token: res.pageToken,
            messages: [...messageList.messages, ...res.messages],
          }));
        });
    };
    fetchMessages(messageList.token);
  }, [messageList.token]);

  useEffect(() => {
    document
      .querySelector("#cards_container")
      .addEventListener("scroll", function (e) {
        console.log(
          "scrolled....",
          this.scrollTop + $(this).innerHeight(),
          "sheigt",
          this.scrollHeight
        );
        console.log(
          "valss...",
          $(this).scrollTop(),
          $(this).innerHeight(),
          $(this)[0].scrollHeight
        );
        if (
          $(this).scrollTop() + $(this).innerHeight() >=
          $(this)[0].scrollHeight
        ) {
          alert("End of DIV is reached!");
          onCardsScroll();
        }
      });
    return () => {
      //document.querySelector("#cards_container").removeEventListener("scroll");
    };
  }, [messageList.token]);

  const getYearsDiff = (date1, date2) => {
    let diff = (date1 - date2) / 1000;
    diff /= 60 * 60 * 24;
    return Math.abs(Math.round(diff / 365.25));
  };
  const onCardsScroll = () => {
    console.log("...in onCardsScroll..");
    setmessageList((prevList) => ({
      ...prevList,
      token: token_holder,
    }));
  };
  return (
    <div className="container">
      <div className="cards_container" id="cards_container">
        {messageList.messages?.map((message, index) => (
          <div className="card" key={index}>
            <div className="author_header order-1">
              <img
                src={`${BASE_URL}/${message.author.photoUrl}`}
                alt="author img"
              />
              <div className="intro">
                <strong>{message.author.name}</strong>
                <small>
                  {getYearsDiff(Date.now(), new Date(message.updated))} years
                  ago
                </small>
              </div>
            </div>
            <div className="author_content order-2">
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
