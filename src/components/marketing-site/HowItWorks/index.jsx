import React from 'react';

import FeatureMark from '$components/common/FeatureMark';
import List from '$components/marketing-site/List';

import model from './model';

import styles from './index.module.scss';
import FeatureHome from '../../common/FeatureHome';

const HowItWorks = () => {
  // render
  return (
    <div className={`container ${styles.panel}`}>
      <div className="row">
        <div className="col-12 col-md-6">
          <p className={styles.panelHeader}>How It Works</p>
          <p className="text-white">There is only one way to avoid criticism: do nothing, say nothing, and be nothing. –Aristotle</p>
          {
            model.map((datum, idx) => (
              <List
                key={`how-it-works-list-${idx}`}
                num={idx + 1}
                title={datum.title}
                description={datum.description}
              />
            ))
          }
        </div>
        <div className="col-12 col-md-1"></div>
        <div className={`col-12 col-md-5 ${styles.howItWorksFeature}`}>
          <FeatureHome
              avatar="zja5uydd1795854_10152370111653109_115441845_o.jpg"
              source="https://i.ibb.co/0G3Mbwp/image-2.png"
              description="This is a music description that can can be upto 2 lines large."
              title="Song Title"
              numOfSongs=""
              duration=""
            />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
