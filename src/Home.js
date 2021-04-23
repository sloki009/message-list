import React, { useState, useEffect } from "react";
import { MESSAGES_API, BASE_URL } from "./api";
import "./Home.css";
import { $ } from "react-jquery-plugin";

var token_holder = "";

function Home() {
  const [messageList, setmessageList] = useState({ token: "", messages: [] });
  useEffect(() => {
    //console.log("in useeff1");
    const fetchMessages = (token) => {
      //console.log("token", token);
      let temp_api = MESSAGES_API;
      if (token) {
        temp_api = `${MESSAGES_API}?pageToken=${token}`;
      }
      console.log(temp_api);
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
    //console.log("in useef 2");
    document
      .querySelector("#cards_container")
      .addEventListener("scroll", function (e) {
        if (
          $(this).scrollTop() + $(this).innerHeight() >=
          $(this)[0].scrollHeight - 10
        ) {
          //alert("End of DIV is reached!");
          onCardsScroll();
        }
      });
  }, [messageList.token]);

  useEffect(() => {
    //console.log("in useeff 3");

    var container = document.getElementsByClassName("card");
    //console.log(container);
    Array.from(container).forEach(function (element) {
      element.addEventListener("touchstart", startTouch, false);
    });
    Array.from(container).forEach(function (element) {
      element.addEventListener("touchmove", moveTouch, false);
    });
    //container.addEventListener("touchstart", startTouch, false);
    //container.addEventListener("touchmove", moveTouch, false);

    // Swipe Up / Down / Left / Right
    var initialX = null;
    var initialY = null;

    function startTouch(e) {
      initialX = e.touches[0].clientX;
      initialY = e.touches[0].clientY;
    }

    function moveTouch(e) {
      if (initialX === null) {
        return;
      }

      if (initialY === null) {
        return;
      }

      var currentX = e.touches[0].clientX;
      var currentY = e.touches[0].clientY;

      var diffX = initialX - currentX;
      var diffY = initialY - currentY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // sliding horizontally
        let element = e.target
          .closest(".message_card")
          .querySelector(".message_card_swipe_buttons");

        if (diffX > 0) {
          // swiped left
          console.log("swiped left");
          element.classList.remove("swipe_btn_show");
          element.classList.add("swipe_btn_hide");
        } else {
          // swiped right
          console.log("swiped right");
          element.classList.remove("swipe_btn_hide");
          element.classList.add("swipe_btn_show");
        }
      }

      initialX = null;
      initialY = null;

      e.preventDefault();
    }
  });

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

  const deleteMesaage = (index) => {
    console.log(messageList.messages[index]);
    let temp = messageList.messages;
    temp.splice(index, 1);
    console.log(temp);
    setmessageList((prevList) => ({
      ...prevList,
      messages: [...temp],
    }));
    document
      .querySelector(".swipe_btn_show")
      .classList.remove("swipe_btn_show");
  };

  const editMessage = () => {
    console.log("in editMessage...");
  };

  return (
    <div className="container">
      {console.log("in render")}
      <div className="cards_container" id="cards_container">
        {messageList.messages?.map((message, index) => (
          <div className="message_card" key={index}>
            <div className="message_card_swipe_buttons order-1">
              <button
                className="edit_swipe bg-green"
                onClick={() => editMessage(index)}
              >
                <h4>Edit</h4>
              </button>
              <button
                className="delete_swipe bg-red"
                onClick={() => deleteMesaage(index)}
              >
                <h4>Delete</h4>
              </button>
            </div>
            <div className="card order-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
