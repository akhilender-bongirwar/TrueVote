import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Context from '../../constant/context';
import { useNavigate } from 'react-router-dom';
import { Modal, Spin } from 'antd';
import './vote.css';

function Vote() {
    const { details, dispatch } = useContext(Context);
    const navigate = useNavigate();
    const [elections, setelections] = useState([]);
    const [voter, setvoter] = useState({});
    const [ismodalopen, setismodalopen] = useState(false);
    const [isloading, setisloading] = useState(false);
    const registrationAlertShownRef = useRef(false);

    useEffect(() => {
        if (details?.account === '' && details?.isConnected === false) {
            navigate('/');
            return;
        }
        return () => {
            console.log('byeee');
        };
    }, []);

    useEffect(() => {
        const getelec = async () => {
            console.log('helloo');
            try {
                setisloading(true);
                const voterr = await details?.instance?.methods.getVoterdetails(details?.account).call({
                    from: details?.account,
                });
                setvoter(voterr);
                if (voterr?.authorized) {
                    try {
                        const n = await details.instance?.methods.noOfElections().call();
                        console.log(n);
                        var elec = [];
                        for (let i = 1; i <= n; i++) {
                            const hasvoted = await details.instance?.methods.hasVoted(details.account, i).call({
                                from: details.account,
                            });
                            if (!hasvoted) {
                                const { id, purpose, candidatesids, status, totalVotes } =
                                    await details.instance?.methods.getElection(i).call({
                                        from: details.account,
                                    });
                                if (status === '2') elec.push({ id, purpose, candidatesids, status, totalVotes });
                            }
                        }
                        setelections(elec);
                        setisloading(false);
                        console.log(elec);
                    } catch (err) {
                        setisloading(false);
                        console.log(err);
                    }
                } else {
                    setisloading(false);
                    if (!registrationAlertShownRef.current) {
                        registrationAlertShownRef.current = true;
                        setismodalopen(true);
                    }
                }
            } catch (err) {
                setisloading(false);
                if (!registrationAlertShownRef.current) {
                    registrationAlertShownRef.current = true;
                    alert('You need to register first!');
                    navigate('/Registration');
                }
                return;
            }
        };

        getelec();
        return () => {
            console.log('');
        };
    }, []);

    const oncancel = () => {
        setismodalopen(false);
        navigate('/');
    };

    return (
        <div className="votepage">
            {isloading && <Spin size="large" className="spinner" />}
            <Modal
                open={ismodalopen}
                destroyOnClose={true}
                closable={true}
                onCancel={() => oncancel()}
                footer={null}
                className="resultmodal"
            >
                <p>You are not verified still.</p>
                <p className="resb">You can vote once the admin verifies your request.</p>
            </Modal>
            {voter && (
                <div className="voterdetailss">
                    <h2>Voter Details</h2>
                    <p>
                        <b>VoterAccount:</b> {details.account}
                    </p>
                    <p>
                        <b>Votername:</b> {voter?.votername}
                    </p>
                    <p>
                        <b>Status:</b> {voter.authorized ? 'Authorized' : 'NotAuthorized'}
                    </p>
                </div>
            )}
            <div className="electiondiv">
                {elections?.length > 0 ? (
                    elections.map((election, ind) => (
                        <div key={ind} className="election">
                            <p>{election.id}</p>
                            <p>{election.purpose}</p>
                            <NavLink to={`/Election/:${election.id}`}>
                                <button type="button" className="votebtn">
                                    Vote
                                </button>
                            </NavLink>
                        </div>
                    ))
                ) : (
                    <p className="noelection">No elections yet</p>
                )}
            </div>
        </div>
    );
}

export default Vote;
