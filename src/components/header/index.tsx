import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import styled from "styled-components";

const HeaderContainer: React.FC = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  color: #048abf;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-family: "Courier New", Courier, monospace;
  font-size: 2em;
  height: 10%;
  width: 40%;
`;

interface HeaderProps {
  loggedInUser: string;
}

export default () => {
  const [siteName, _] = useState("qa.code-quiz.dev");
  const { user } = useContext(AuthContext);

  return (
    <HeaderContainer data-testid="header">
      <div data-testid="header-content">
        {user ? `Hello ${user.name}` : `${siteName}`}
      </div>
    </HeaderContainer>
  );
};
