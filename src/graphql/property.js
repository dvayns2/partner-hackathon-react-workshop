import gql from 'graphql-tag';

export default gql`
    query($propertyId: String!) {
        property(propertyId: $propertyId) {
            metrics {
                market {
                    name
                    marketSize
                }
                scorecard {
                    minStay {
                        rankInMarket
                        lastUpdated
                        value
                    }
                    marketRank {
                        rankInMarket
                        lastUpdated
                        value
                    }
                }
            }
        }
    }
`;