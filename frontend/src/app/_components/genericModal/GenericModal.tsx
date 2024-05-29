import React from "react";
import PropTypes from "prop-types";
import { Button } from "../summary/component/waitlist/styles";

interface Props {
  message: string;
  redirect?: string;
  closeButton: boolean;
  color?: string;
}
const GenericModal: React.FC<Props> = (props) => {
  return (
    <div>
      <div>{props.message}</div>
      {props.redirect ? <p>{props.redirect}</p> : null}
      {props.closeButton ? <button>Close</button> : null}
    </div>
  );
};

GenericModal.propTypes = {};

export default GenericModal;
