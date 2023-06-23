import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, TextField, Container } from '@mui/material';
import { loginWithToken } from '../store';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useSnackbar } from 'notistack';

const CreateAddress = () => {
	const { auth } = useSelector((state) => state);
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const [address, setAddress] = useState({
		label: '',
		street1: '',
		street2: '',
		city: '',
		state: '',
		zipcode: '',
		country: '',
	});

	const [open, setOpen] = useState(false);
	const [error, setError] = useState({});

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const onChange = (ev) => {
		setAddress({ ...address, [ev.target.name]: ev.target.value });
	};

	const save = async (ev) => {
		ev.preventDefault();
		address.userId = auth.id;
		try {
			await axios.post('/api/addresses', address);
			setAddress({
				label: '',
				street1: '',
				street2: '',
				city: '',
				state: '',
				zipcode: '',
				country: '',
			});
			enqueueSnackbar('You created a new address!', {
				variant: 'success',
			});
			await dispatch(loginWithToken());
			handleClose();
		} catch (ex) {
			setError(ex.response.data);
		}
	};

	let messages = [];
	if (error.errors) {
		messages = error.errors.map((e) => e.message);
	}

	return (
		<div>
			<Fragment>
				<Button
					sx={{
						minWidth: '100%',
					}}
					variant='contained'
					onClick={handleClickOpen}
				>
					Create a new address
				</Button>
				<Dialog open={open} onClose={handleClose}>
					<DialogContent>
						<DialogContentText>
							To start getting tasty bundles, create an address for your
							profile.
						</DialogContentText>
						<form onSubmit={save}>
							<Typography variant='h6' gutterBottom>
								Create a New Address to Save to your Profile
							</Typography>
							<ul>
								{messages.map((message) => {
									return (
										<li key={message} className={'error'}>
											{message}
										</li>
									);
								})}
							</ul>
							<div>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<TextField
											required
											name='label'
											label='New Address Label'
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
									<Grid item xs={12} sm={6}>
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
									<Grid item xs={12} sm={6}>
										<TextField
											name='state'
											label='State/Province/Region'
											fullWidth
											variant='filled'
											value={address.state}
											onChange={onChange}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
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
									<Grid item xs={12} sm={6}>
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
							</div>
						</form>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={save} variant='contained'>
							Create new Address
						</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		</div>
	);
};

export default CreateAddress;
