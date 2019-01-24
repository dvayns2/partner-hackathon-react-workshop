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
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Loading from '../Common/Loading/Loading';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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

class SinglePropertyPage extends Component {
    state = { expanded: false };

    handleExpandClick = () => {
      this.setState(state => ({ expanded: !state.expanded }));
    };

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
                subheader={mergedProperty.externalId}
              />
              <CardMedia
                className={classes.media}
                image={mergedProperty.image}
                title={mergedProperty.title}
              />
              <CardContent>
                <Typography component="p">
                  This impressive paella is a perfect party dish and a fun meal to cook together with your
                  guests. Add 1 cup of frozen peas along with the mussels, if you like.
                </Typography>
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
                  <Typography paragraph>Method:</Typography>
                  <Typography paragraph>
                    Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                    minutes.
                  </Typography>
                  <Typography paragraph>
                    Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                    heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                    browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
                    chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
                    salt and pepper, and cook, stirring often until thickened and fragrant, about 10
                    minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                  </Typography>
                  <Typography paragraph>
                    Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                    without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat
                    to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and
                    cook again without stirring, until mussels have opened and rice is just tender, 5 to 7
                    minutes more. (Discard any mussels that don’t open.)
                  </Typography>
                  <Typography>
                    Set aside off of the heat to let rest for 10 minutes, and then serve.
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
        );
    }
}

export default withStyles(styles)(graphql(propertyQuery, {
    options: (ownProps) => ({variables: {propertyId: ownProps.match.params.externalId}})
})(SinglePropertyPage));
