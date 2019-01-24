/**
Copyright 2018 Expedia Group, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import Loading from '../Common/Loading/Loading';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotFound from '../Common/NotFound/NotFound';
import PropTypes from 'prop-types';
import ShareIcon from '@material-ui/icons/Share';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { graphql } from 'react-apollo';
import classnames from 'classnames';
import properties from '../../data/properties.json';
import propertyQuery from '../../graphql/property';
import red from '@material-ui/core/colors/red';
// import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  icon: {
      verticalAlign: 'middle'
  },
  checkbox: {
      marginBottom: 20
  }
});

export const urlDecodeExternalId = (externalId) => {
    let decodedUrl = decodeURIComponent(externalId);
    return decodedUrl;
};

export const getMockPropertyByExternalId = (externalId) => {
    const property = properties.find((property) => {
        return property.externalId === externalId;
    });
    return property;
};

const basePotentialSearchTraffic = 6.25;

class SinglePropertyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            potentialSearchTraffic: basePotentialSearchTraffic,
            minStayCheckedItems: new Map()
        };

        this.handleMinStayCheckboxChanged = this.handleMinStayCheckboxChanged.bind(this);
    }

    handleExpandClick = () => {
      this.setState(state => ({ expanded: !state.expanded }));
    };

    handleMinStayCheckboxChanged = (e) => {
        const name = e.target.name; // name is maxDays
        const isChecked = e.target.checked;
        const recommendedChanges = this.recommendedChanges;

        this.setState(prevState => ({ minStayCheckedItems: prevState.minStayCheckedItems.set(name, isChecked) }), () => {
            const checkedItems = Array.from(this.state.minStayCheckedItems);
            const newPotentialSearchTraffic = checkedItems.reduce((accumulator, currentValue, currentIndex, array) => {
                const maxDays = `${currentValue[0]}`;
                const foundChange = recommendedChanges.find((change) => {
                    return (
                        change.maxDays.toString() === maxDays && currentValue[1] === true
                    );
                });
                
                return accumulator + (foundChange ? foundChange.expectedIncreasedOfViews : 0);
            }, basePotentialSearchTraffic);
            
            this.setState({ potentialSearchTraffic: newPotentialSearchTraffic });
        });
    }

    renderRecommendedMinStayChanges(recommendedChanges) {
        return recommendedChanges.map((recommendedChange, i) => {
            const { classes } = this.props;

            return (
                <FormControlLabel
                    key={i}
                    className={classes.checkbox}
                    control={
                        <Checkbox
                            name={`${recommendedChange.maxDays}`}
                            onChange={this.handleMinStayCheckboxChanged}
                            value={`${recommendedChange.expectedIncreasedOfViews}`}
                        />
                    }
                    label={
                        <Typography>
                            <strong>{`Within ${recommendedChange.minDays} to ${recommendedChange.maxDays} days`}</strong><br />
                            {`Set your min stay to ${recommendedChange.recommendations} day to gain an expected ${recommendedChange.expectedIncreasedOfViews}% more pageviews`}
                        </Typography>
                    }
                />
            );
        });
    }

    render() {
        if (this.props.data.loading) {
            return <Loading />;
        }

        if (!this.props.data.property) {
            return <NotFound />;
        }

        const { classes } = this.props;
        const externalId = urlDecodeExternalId(this.props.match.params.externalId);
        const property = getMockPropertyByExternalId(externalId);
        const mergedProperty = Object.assign({}, property, this.props.data.property);
        var boostOpportunities = 0;
        if (mergedProperty.boost.opportunities.opportunities.length) {
          boostOpportunities = mergedProperty.boost.opportunities.opportunities.length
        }
        const subheaderText = `${boostOpportunities} opportunities to boost`;
        this.recommendedChanges = mergedProperty.recommendedChanges;

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="VacayHomeConnect" className={classes.avatar}>
                            V
                  </Avatar>
                    }
                    action={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={mergedProperty.title}
                    subheader={subheaderText}
                />
                <CardMedia
                    className={classes.media}
                    image={mergedProperty.image}
                    title={mergedProperty.title}
                />
                <CardContent>
                    <Typography component="p">
                        {mergedProperty.description}
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography variant="h6">
                        Availability
                    </Typography>
                    <Typography paragraph color="error">
                        <NotificationImportantIcon className={classes.icon} />Your property is at risk of not being booked!
                    </Typography>
                    <Typography paragraph>
                        <strong>There are still {mergedProperty.availability.daysAvailablewithinBookingWindow} of&nbsp;
                        {mergedProperty.availability.bookingWindow} days available for travelers to book.</strong>
                    </Typography>
                    <Typography paragraph>
                        <em>You can improve your booking rate and revenue generated by taking some of the
                        recommended actions below.</em>
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography variant="h6">
                        Recommended Actions
                    </Typography>
                    <Typography paragraph>
                        Lower your Minimum Stay to maximize your bookings, especially as your booking window begins to shrink.
                    </Typography>
                    <Typography paragraph variant="subtitle2">
                        Potential search traffic: <strong>{this.state.potentialSearchTraffic}%</strong>
                    </Typography>
                    <FormControl component="fieldset" className={classes.formControl}>
                        {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
                        <FormGroup>
                            {this.renderRecommendedMinStayChanges(mergedProperty.recommendedChanges)}
                        </FormGroup>
                        {/* <FormHelperText>Be careful</FormHelperText> */}
                    </FormControl>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton aria-label="Add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography variant="caption">
                            {`ID: ${mergedProperty.externalId}`}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}

SinglePropertyPage.propTypes = {
    classes: PropTypes.object,
    match: PropTypes.object,
    data: PropTypes.object
};

export default withStyles(styles)(graphql(propertyQuery, {
    options: (ownProps) => ({variables: {propertyId: ownProps.match.params.externalId}})
})(SinglePropertyPage));
