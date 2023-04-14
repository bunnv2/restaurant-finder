import * as React from 'react';
import { ThemeProvider, styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
import { Theme } from '@emotion/react';

export type restaurant = {
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: string;
  photo: {
    images: {
      large: {
        url: string;
      };
    };
  };
};



interface Props {
  restaurant: restaurant;
  theme: Theme;
  addToFavorites: (restaurant: restaurant) => void;
  tabPanel: '1' | '2';
}

export default function RestaurantCard(props: Props) {
  const { restaurant } = props;
  const { theme } = props;

  if (props.tabPanel==="2") console.log(restaurant);


  return (
    <ThemeProvider  theme={theme}>
    <Card sx={{ maxWidth: 'fullWidth' , marginTop: '10px'}}>
      <CardHeader
        title={restaurant.name}
        subheader={restaurant.address}
        titleTypographyProps={{color:'secondary'}} />
      <CardMedia
        component="img"
        src={restaurant.photo.images.large.url}
      />
      <CardContent>
        <Typography variant="body2" color="secondary">
          Rating: {restaurant.rating} 
        </Typography>
        <Typography variant="body2" color="secondary">
          Phone: {restaurant.phone} 
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {props.tabPanel === '1' && 
          <IconButton aria-label="add to favorites" onClick={()=>props.addToFavorites(restaurant)}>
            <FavoriteIcon color='error' />
          </IconButton>
        }
        <IconButton aria-label="add to favorites">
        <Link to={restaurant.website}><LinkIcon color='info' /></Link>
        </IconButton>
      </CardActions>
    </Card>
    </ThemeProvider>
  );
}
