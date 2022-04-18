import React from "react";
import PieDemo from "../HalfDonutChart";
import styles from "./TeamCard.module.css";

const TeamCard = ({
  item,
  averageSelectionById,
  getTeamCount,
  getEmotionForRedSelection,
}) => {
  return (
    <>
      <div className={styles.Team} key={item}>
        <div className={styles.TeamName}>{item}</div>
        <div className={styles.TeamSelection}>
          <div>
            <PieDemo data={averageSelectionById(item)} />
          </div>
          <div className={styles.SelectionCardDetails}>
            <div className={styles.TeamMembers}>
              {getTeamCount(item)}&nbsp;Team members
            </div>
            <div className={styles.EmotionsSection}>
              <div className={styles.EmotionsListTitle}>
                Pre-eminent Emotions
              </div>
              <div>
                {getEmotionForRedSelection(item).length > 0
                  ? getEmotionForRedSelection(item)
                  : "None"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamCard;
