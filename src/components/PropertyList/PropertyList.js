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
import PropertyListItem from '../PropertyListItem/PropertyListItem.js';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';

const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    cardGrid: {
        padding: `${theme.spacing.unit * 4}px 0`,
    },
    pageTitle: {
        margin: '10px'
    }
});

class PropertyList extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className="property-list">
                <Typography variant="h4" className={classes.pageTitle}>
                    My Properties
                </Typography>
                <div className={classNames(classes.layout, classes.cardGrid)}>
                    {this.props.properties.map(property => (
                        <PropertyListItem key={property.externalId} property={property} />
                    ))}
                </div>
            </div>
        );
    }
}

PropertyList.propTypes = {
    properties: PropTypes.array
};

export default withStyles(styles)(PropertyList);
