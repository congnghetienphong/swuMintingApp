import styled from "styled-components";

export const StyledImgGalary = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  /* background-color: var(--accent);j */
  border-radius: 10%;
  width: 700px;
  overflow:hidden;

  background-color: ${(props) => props.backgroundColor};

  /* @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  } */
  /* transition: width 0.5s; */
`;