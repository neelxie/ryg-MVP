import React, { Component } from "react";
import styles from "./Home.module.css";
import Logo from "../../assets/img/kona-logo.png";
import Papa from "papaparse";
import PieDemo from "../HalfDonutChart";
import TeamCard from "../TeamCard";
const csvFile = require("../../assets/rygs.csv");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      teamIds: [],
      slackAdmin: [],
      teams: [],
      overallSelection: {},
    };
  }

  componentDidMount() {
    // On component mount, get the data from the csv file
    // and save it to the state
    // Get all team id's
    Papa.parse(csvFile, {
      header: true,
      download: true,
      complete: (results) => {
        // dynamically create a team for each team id
        this.setState({
          data: results.data,
          teamIds: [...new Set(results.data?.map((item) => item.SlackTeamId))],
          slackAdmin: [
            ...new Set(results.data?.map((item) => item.SlackOrgId)),
          ],
          // add a teams variable
          teams: [
            ...new Set(results.data?.map((item) => item.SlackTeamId)),
          ].map((item) => {
            return {
              [item]: [...this.teamData(results.data, item)],
            };
          }),
        });
      },
    });
  }

  // Get team data by team ID and save to an array
  teamData(arr, teamId) {
    let team = [];
    arr.map((item) => (item.SlackTeamId === teamId ? team.push(item) : null));
    return team;
  }

  // the the total number of each emotion for all teams
  totalSelection() {
    let total = {
      red: 0,
      yellow: 0,
      green: 0,
    };

    this.state.teamIds.map((itemId) => {
      let team = this.teamData(this.state.data, itemId);
      team.map((item) => {
        if (item.Selection === "red") {
          total.red += 1;
        } else if (item.Selection === "yellow") {
          total.yellow += 1;
        } else if (item.Selection === "green") {
          total.green += 1;
        }
      });
    });
    return total;
  }

  // Take an array of data and return an object of emotion about the team
  avaerageSelection(arr) {
    let selections = {
      red: 0,
      yellow: 0,
      green: 0,
    };
    arr?.map((item) => {
      if (item.Selection == "red") {
        selections.red++;
      } else if (item.Selection == "yellow") {
        selections.yellow++;
      } else if (item.Selection == "green") {
        selections.green++;
      }
    });

    return selections;
  }

  averageSelectionById(teamID) {
    let team = this.teamData(this.state.data, teamID);
    let selections = {
      red: 0,
      yellow: 0,
      green: 0,
    };
    team?.map((item) => {
      if (item.Selection == "red") {
        selections.red++;
      } else if (item.Selection == "yellow") {
        selections.yellow++;
      } else if (item.Selection == "green") {
        selections.green++;
      }
    });
    return selections;
  }

  getTeamCount(teamId) {
    let team = this.teamData(this.state.data, teamId);
    let TeamMembers = [];
    team.map((item) => {
      TeamMembers.push(item.SlackUserId);
    });
    // remove double entries
    let newTeamArray = [...new Set(TeamMembers)];
    return newTeamArray.length;
  }

  // get emotions for red selections by team
  getEmotionForRedSelection(teamId) {
    let team = this.teamData(this.state.data, teamId);
    let emotions = [];
    team.map((item) => {
      if (item.Selection === "red" && item.Emotion !== "") {
        emotions.push(item.Emotion);
      }
    });
    // remove any duplicates
    let duplicateFreeArray = [...new Set(emotions)];
    return (
      // map array of emotions to display
      duplicateFreeArray.map((item) => {
        return (
          <li className={styles.Emotion} key={item}>
            {item}
          </li>
        );
      })
    );
  }

  render() {
    return (
      <div className={styles.Main}>
        <div className={styles.MainTop}>
          <img src={Logo} alt="Logo" className={styles.LogoIcon} />
          <div
            className={styles.User}
          >{`Signed in as ${this.state.slackAdmin[0]}`}</div>
        </div>
        <div className={styles.MainSection}>
          <div className={styles.Overview}>
            <div className={styles.OverviewTitle}>Overview</div>
            <div className={styles.OverviewContent}>
              <div className={styles.OverviewContentItem}>
                <div>
                  <PieDemo data={this.totalSelection()} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.Teams}>
            {this.state.teamIds.map((item) => {
              return (
                <div className={styles.Team} key={item}>
                  <div className={styles.TeamName}>{item}</div>
                  <div className={styles.TeamSelection}>
                    <div>
                      <PieDemo data={this.averageSelectionById(item)} />
                    </div>
                    <div className={styles.SelectionCardDetails}>
                      <div className={styles.TeamMembers}>
                        {this.getTeamCount(item)}&nbsp;Team members
                      </div>
                      <div className={styles.EmotionsSection}>
                        <div className={styles.EmotionsListTitle}>
                          Pre-eminent Emotions
                        </div>
                        <div>
                          {this.getEmotionForRedSelection(item).length > 0
                            ? this.getEmotionForRedSelection(item)
                            : "None"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
