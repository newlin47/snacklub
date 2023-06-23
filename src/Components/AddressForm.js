import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateAddress } from '../store';
import { Grid, Typography, TextField, FormHelperText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useSnackbar } from 'notistack';

export default function AddressForm() {
	const { auth } = useSelector((state) => state);
	const { cart } = useSelector((state) => state);
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const [addresses, setAddresses] = useState([]);
	const [address, setAddress] = useState({
		label: '',
		street1: '',
		street2: '',
		city: '',
		state: '',
		zipcode: '',
		country: '',
	});
	const [error, setError] = useState({});

	useEffect(() => {
		if (auth) {
			setAddresses(auth.addresses);
			if (addresses && auth) {
				console.log(addresses);
				const last = addresses.length - 1;
				const address = addresses[last];
				if (address) {
					setAddress(address);
				}
			}
		}
	}, [addresses, auth]);

	const onChange = (ev) => {
		setAddress({ ...address, [ev.target.name]: ev.target.value });
	};

	const changeAddress = (ev) => {
		ev.preventDefault();
		const id = ev.target.value;
		const newAddress = addresses.find((x) => x.id === id);
		setAddress(newAddress);
	};

	const saveAddress = async (ev) => {
		ev.preventDefault();
		try {
			await axios.put(`/api/addresses/${address.id}`, address);
			enqueueSnackbar('You saved changes to this address!', {
				variant: 'success',
			});
			await dispatch(updateAddress(address));
			handleClose();
		} catch (ex) {
			setError(ex.response.data);
		}
	};
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	let messages = [];
	if (error.errors) {
		messages = error.errors.map((e) => e.message);
	}

	return (
		<Fragment>
			<Button
				variant='contained'
				sx={{
					minWidth: '100%',
				}}
				onClick={handleClickOpen}
			>
				Add address to order
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<FormControl onSubmit={saveAddress}>
						<Grid container align='center' spacing={3}>
							<Grid item xs={12}>
								<Typography variant='h3' gutterBottom>
									Shipping Address
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<FormControl>
									<Select
										value={address.id || ''}
										onChange={changeAddress}
										variant='filled'
									>
										{addresses.map((_address) => {
											return (
												<MenuItem key={_address.id} value={_address.id}>
													{_address.label}
												</MenuItem>
											);
										})}
									</Select>
									<FormHelperText>Select an address to use: </FormHelperText>
								</FormControl>
							</Grid>

							<Grid item xs={12}>
								<ul>
									{messages.map((message) => {
										return (
											<li key={message} className={'error'}>
												{message}
											</li>
										);
									})}
								</ul>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									name='label'
									label='Address Label'
									fullWidth
									variant='filled'
									value={address.label}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									name='street1'
									label='Address line 1'
									fullWidth
									variant='filled'
									value={address.street1}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name='street2'
									label='Address line 2'
									fullWidth
									variant='filled'
									value={address.street2}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									name='city'
									label='City'
									fullWidth
									variant='filled'
									value={address.city}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									name='state'
									label='State/Province/Region'
									fullWidth
									variant='filled'
									value={address.state}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									name='zipcode'
									label='Zipcode / Postal code'
									fullWidth
									variant='filled'
									value={address.zipcode}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									name='country'
									label='Country'
									fullWidth
									variant='filled'
									value={address.country}
									onChange={onChange}
								/>
							</Grid>
						</Grid>
					</FormControl>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={saveAddress} variant='contained'>
							Use this address
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</Fragment>
	);
}
