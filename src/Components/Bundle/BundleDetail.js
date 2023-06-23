import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
	Grid,
	Container,
	CardMedia,
	Typography,
	Button,
	Box,
	Fab,
	CssBaseline,
	ToggleButtonGroup,
	ToggleButton,
} from '@mui/material';
import SnackItemCard from '../SnacksPage/SnackItemCard';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { addQtyCart, fetchCart } from '../../store';

const theme = createTheme();

const BundleDetail = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { bundles, cart } = useSelector((state) => state);
	const [bundle, setBundle] = useState({});
	const [products, setProducts] = useState([]);
	const [subscription, setSubscription] = useState('Monthly');
	const [size, setSize] = useState('Small');
	const [price, setPrice] = useState(`$ 0.00`);
	const [basePrice, setBasePrice] = useState(0);

	const handleSubscription = (event, newSubscription) => {
		console.log('clicked');
		console.log('last is:' + subscription);
		if (newSubscription !== null) {
			setSubscription(newSubscription);
			if (newSubscription == 'Monthly') {
				if (size == 'Small') {
					setPrice(`$${basePrice}`);
					console.log(1);
				} else {
					setPrice(`$${(basePrice * 1.75).toFixed(2)}`);
				}
			} else {
				if (size == 'Small') {
					setPrice(`$${(basePrice * 1.75).toFixed(2)}`);
					console.log(1);
				} else {
					setPrice(`$${(basePrice * 11 * 1.75).toFixed(2)}`);
				}
			}
		}
	};

	const handleSize = (event, newSize) => {
		if (newSize !== null) {
			setSize(newSize);
			if (newSize == 'Large') {
				if (subscription == 'Monthly') {
					setPrice(`$${(basePrice * 1.75).toFixed(2)}`);
					console.log(1);
				} else {
					setPrice(`$${(basePrice * 1.75 * 11).toFixed(2)}`);
				}
			} else {
				if (subscription == 'Monthly') {
					setPrice(`$${basePrice}`);
					console.log(1);
				} else {
					setPrice(`$${(basePrice * 11).toFixed(2)}`);
				}
			}
		}
	};

	useEffect(() => {
		if (bundles.length) {
			const bundle = bundles.find((bundle) => bundle.id === id);
			setBundle(bundle);
			setProducts(bundle.products);
			setBasePrice(parseInt(bundle.price).toFixed(2));
			setPrice(`$ ${parseInt(bundle.price).toFixed(2)}`);
		}
		dispatch(fetchCart());
	}, [bundles]);

	const { enqueueSnackbar } = useSnackbar();
	const handleClickVariant = () => {
		const item = cart.lineItems.find(
			(lineItem) => lineItem.bundleId === bundle.id
		);
		if (item) {
			dispatch(addQtyCart(item.bundle, 1, item.size, item.frequency));
		} else {
			dispatch(addQtyCart(bundle, 1, size, subscription));
		}
		enqueueSnackbar('Item added to your cart!', { variant: 'success' });
	};

	return (
		<ThemeProvider>
			<CssBaseline />
			<div>
				<Fab
					variant='extended'
					color='primary'
					sx={{
						margin: 0,
						top: 'auto',
						right: 20,
						bottom: 20,
						left: 'auto',
						position: 'fixed',
					}}
					onClick={(ev) => {
						ev.preventDefault();
						handleClickVariant();
					}}
				>
					<AddIcon sx={{ mr: 1 }} />
					Add to Cart
				</Fab>
			</div>
			<div>
				<div>
					<Container sx={{ py: 8 }} maxWidth='lg'>
						<Grid container spacing={2}>
							<Grid item md={7}>
								<CardMedia
									sx={{ maxHeight: '590px' }}
									component='img'
									height='100%'
									image={bundle.imageUrl}
									alt='image'
								/>
							</Grid>
							<Grid item md={5}>
								<Container
									sx={{
										margin: '5',
									}}
								>
									<Typography variant='h3' gutterBottom>
										{bundle.name}
									</Typography>
									<Typography variant='h4' gutterBottom>
										{price}
									</Typography>
									<Typography variant='p' gutterBottom>
										{bundle.description}
									</Typography>
									<br></br>
									<br></br>
									<Typography variant='h5' gutterBottom>
										Frequency
									</Typography>
									<ToggleButtonGroup
										value={subscription}
										exclusive
										onChange={handleSubscription}
										aria-label='subscription'
										fullWidth='true'
									>
										<ToggleButton value='Monthly' aria-label='Monthly'>
											Monthly
										</ToggleButton>
										<ToggleButton value='Annually' aria-label='Snnually'>
											Annually
										</ToggleButton>
									</ToggleButtonGroup>
									<br></br>
									<br></br>
									<Typography variant='h5'>Size</Typography>
									<ToggleButtonGroup
										value={size}
										exclusive
										onChange={handleSize}
										aria-label='small'
										fullWidth='true'
									>
										<ToggleButton value='Small' aria-label='Small'>
											Small
										</ToggleButton>
										<ToggleButton value='Large' aria-label='Large'>
											Large
										</ToggleButton>
									</ToggleButtonGroup>
									<br></br>
									<br></br>
									<Button
										sx={{ mt: '10' }}
										size='large'
										fullWidth='true'
										variant='contained'
										onClick={handleClickVariant}
										color='primary'
									>
										Add To Cart
									</Button>
									<Button
										sx={{ mt: '10' }}
										size='large'
										fullWidth='true'
										variant='contained'
									>
										<Link
											to={'/bundles'}
											style={{ textDecoration: 'none', color: 'black' }}
										>
											Return to our other bundles
										</Link>
									</Button>
								</Container>
							</Grid>
						</Grid>
						<br></br>
						<br></br>
						<Typography variant='h4'>This Bundle May Include...</Typography>
						<br />
						<Typography variant='h5'>
							Every time you receive a delivery of this bundle, you'll get a
							randomized selection of the snacks you see below. Just choose a
							frequency and size to start snacking!
						</Typography>
						<br />
						<Container sx={{mt: 4}} maxWidth='lg' align='center'>
							<Grid container spacing={1} sx={{justifyContent: "center"}}>
								{products.map((product) => {
									return (
										<Grid item md={3}>
											<SnackItemCard card={product}></SnackItemCard>
										</Grid>
									);
								})}
							</Grid>
						</Container>
					</Container>
				</div>
			</div>
		</ThemeProvider>
	);
};
export default BundleDetail;
