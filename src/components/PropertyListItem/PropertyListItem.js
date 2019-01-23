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
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    }
});

export const urlEncodePropertyId = (propertyId) => {
    let encodedUrl = encodeURI(propertyId);
    encodedUrl = encodedUrl.replace(/\//ig, '%2F');
    return encodedUrl;
};

class PropertyListItem extends Component {
    render() {
        const { property, classes } = this.props;

        return (
            <Grid item key={property.externalId} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                <CardMedia
                    className={classes.cardMedia}
                    image={property.image}
                    title="Image title"
                />
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {property.title}
                    </Typography>
                    <Typography>
                        {property.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/home/property/${urlEncodePropertyId(property.externalId)}`}>
                        View
                    </Button>
                </CardActions>
                </Card>
            </Grid>
        );
    }
}

PropertyListItem.propTypes = {
    property: PropTypes.object.isRequired
};

export default withStyles(styles)(PropertyListItem);
