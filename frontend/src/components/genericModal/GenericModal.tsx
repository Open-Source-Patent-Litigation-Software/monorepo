import React from "react";
import PropTypes from "prop-types";
import "../summary/component/waitlist/waitlist.css";

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
      {props.closeButton ? <button className="button">Close</button> : null}
    </div>
  );
};

GenericModal.propTypes = {};

export default GenericModal;