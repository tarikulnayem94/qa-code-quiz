import React, { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import styled from "styled-components";

type HeaderProps = {
  loggedInUser: string;
};

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Courier New", Courier, monospace;
  background-color: rgba(247, 247, 247, 0.4);
  width: 40%;
  height: 85%;
  margin-bottom: 5%;
`;

const Row = styled.div`
  display: flex;
  width: 90%;
  margin-top: 20px;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
    background-color: #048ABF;
    border: none;
    margin-top: 5px;
    margin-top: 20px
    border-radius: 15px;
    width: 50%;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.5em;
    font-weight: light;
    color: white;
    transition: background-color 0.1s ease-in;
    outline:none;
    :active {
        outline: none;
        background-color: #F54458;
    }

`;
export default () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AccountContainer data-testid="account-container">
      <Row data-testid="name-row">
        <div>Name</div>
        <div data-testid="user-name">{user.name}</div>
      </Row>
      <Row data-testid="fruit-row">
        <div>Favourite Fruit</div>
        <div data-testid="user-fruit">{user.favouriteFruit}</div>
      </Row>
      <Row data-testid="movie-row">
        <div>Favourite Movie</div>
        <div data-testid="user-movie">{user.favouriteMovie}</div>
      </Row>
      <Row data-testid="number-row">
        <div>Favourite Number</div>
        <div data-testid="user-number">{user.favouriteNumber}</div>
      </Row>
      <Button
        data-testid="logout-button"
        onClick={() => {
          logout();
        }}
      >
        LOGOUT
      </Button>
    </AccountContainer>
  );
};
