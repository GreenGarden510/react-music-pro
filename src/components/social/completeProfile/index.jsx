import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import DonutProgress from '../../common/DonutProgress';
import styles from './index.module.scss';
import { blueprint } from './blueprint';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { routePaths } from '../../../common/routeConfig';

export const CompleteProfile = () => {
    //hooks
    const { push } = useHistory();

    //state
    const [progress, setProgress] = useState(0);
    const [fields, setFields] = useState([]);
    
    //store
    const profile = useSelector(state => state.authentication.user)

    //effects
    useEffect(() => {
        if (!profile) return;
        const blueprintKeys = Object.keys(blueprint);
        const profileKeys = Object.keys(profile);
        const intersection = _.intersection(blueprintKeys, profileKeys);
       
        let sortable = [];
        let totalScore = 0;
        let complete = 0;

        intersection.forEach(key => {
            const score = blueprint[key].score
            totalScore += score;
            if (profile[key]) {
                complete += score;
            } else {
                sortable.push([key, blueprint[key].score]);
            }
        }); 

        setProgress(complete/totalScore * 100);
        const _fields = sortable.sort((a, b) => b[1] - a[1]).slice(0,3).map((item) => {
            return {
                name: blueprint[item[0]].display,
                percent: _.round(blueprint[item[0]].score/totalScore*100),
            }
        });
        setFields(_fields);
    }, [profile]);

    if (progress >= 100) {
        return <span></span>
    }

    return (
        <div className={`${styles.card}`}>
            <h3>Complete Profile</h3>
            <p>Your profile is missing the followings!</p>
            <div className="d-flex justify-content-center">
                <DonutProgress progress={progress} height={100} width={100} />
            </div>
            <div className="mt-5" onClick={() => push(routePaths.profile)}>
            {fields.map(field => {
                return (
                    <div key={field.name} className={`d-flex align-items-center ${styles.missingField}`}>
                        <img src={require("$assets/images/icons/plus.svg")} alt="" />
                        <div>{field.name}</div>
                        <span>{field.percent}%</span>
                    </div>
                )
            })}
            </div>
        </div>
    )
}
