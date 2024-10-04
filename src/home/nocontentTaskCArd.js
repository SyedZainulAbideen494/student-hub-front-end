import React, { Fragment } from "react";
import './nocontentcard.css';

const NoContentCardTask = () => {
    return (
        <Fragment>
            <div className="center__no__content__home">
                <div className="design__no__content__home">
                    <div className="circle-1__no__content__home center__no__content__home color-border__no__content__home">
                        <div className="circle-2__no__content__home center__no__content__home color-border__no__content__home">
                            <div className="circle-3__no__content__home center__no__content__home color-border__no__content__home">
                                <div className="circle-4__no__content__home center__no__content__home color-border__no__content__home">
                                    <div className="circle-5__no__content__home">
                                        <div className="in-circle-1__no__content__home in-circle__no__content__home"></div>
                                        <div className="in-circle-2__no__content__home in-circle__no__content__home"></div>
                                        <div className="in-circle-3__no__content__home in-circle__no__content__home"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mountain-1__no__content__home shape__no__content__home shadow__no__content__home"></div>
                    <div className="mountain-2__no__content__home shape__no__content__home"></div>
                    <div className="mountain-3__no__content__home shape__no__content__home shadow__no__content__home"></div>
                </div>
                <div className="message__no__content__home">
                You have no tasks today, you're free!
                </div>
            </div>
        </Fragment>
    );
};

export default NoContentCardTask;
