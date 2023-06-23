const conn = require('./conn');
const { STRING, UUID, UUIDV4, TEXT } = conn.Sequelize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;
const { Address } = require('../db');

const User = conn.define('user', {
	id: {
		type: UUID,
		primaryKey: true,
		defaultValue: UUIDV4,
	},
	username: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
		unique: true,
	},
	password: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	firstName: {
		type: STRING,
		// allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	lastName: {
		type: STRING,
		// allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	email: {
		type: STRING,
		// allowNull: false,
		validate: {
			notEmpty: true,
			isEmail: true,
		},
	},
	avatar: {
		type: TEXT,
		get: function () {
			const prefix = 'data:image/png;base64,';
			const data = this.getDataValue('avatar');
			if (!data) {
				return data;
			}
			if (data.startsWith(prefix)) {
				return data;
			}
			return `${prefix}${data}`;
		},
	},
});

User.prototype.createOrder = async function ({ total, tax }) {
	const cart = await this.getCart();
	cart.isCart = false;
	cart.total = total;
	cart.tax = tax;
	await cart.save();
	return cart;
};

User.prototype.getOrder = async function () {
	let order = await conn.models.order.findAll({
		where: {
			userId: this.id,
			isCart: false,
		},
		include: [
			{
				model: conn.models.lineItem,
				include: [conn.models.bundle],
			},
			{
				model: conn.models.address,
			},
		],
	});
	return order;
};

User.prototype.getCart = async function () {
	let cart = await conn.models.order.findOne({
		where: {
			userId: this.id,
			isCart: true,
		},
	});
	if (!cart) {
		cart = await conn.models.order.create({
			userId: this.id,
		});
	}
	cart = await conn.models.order.findByPk(cart.id, {
		include: [
			{
				model: conn.models.lineItem,
				include: [conn.models.bundle],
			},
			{
				model: conn.models.address,
			},
		],
		order: [[conn.models.lineItem, 'id', 'DESC']],
	});
	return cart;
};

User.prototype.addToCart = async function ({
	bundle,
	quantity,
	size,
	frequency,
}) {
	const cart = await this.getCart();
	let lineItem = cart.lineItems.find((lineItem) => {
		return lineItem.bundleId === bundle.id;
	});
	if (lineItem) {
		lineItem.quantity += quantity;
		lineItem.size = size;
		lineItem.frequency = frequency;
		await lineItem.save();
	} else {
		await conn.models.lineItem.create({
			orderId: cart.id,
			bundleId: bundle.id,
			quantity,
			size,
			frequency,
		});
	}
	return this.getCart();
};

User.prototype.removeFromCart = async function ({ bundle, quantityToRemove }) {
	const cart = await this.getCart();
	const lineItem = cart.lineItems.find((lineItem) => {
		return lineItem.bundleId === bundle.id;
	});
	lineItem.quantity = lineItem.quantity - quantityToRemove;
	if (lineItem.quantity > 0) {
		await lineItem.save();
	} else {
		await lineItem.destroy();
	}
	return this.getCart();
};

User.addHook('beforeSave', async (user) => {
	if (user.changed('password')) {
		user.password = await bcrypt.hash(user.password, 5);
	}
});

User.findByToken = async function (token) {
	try {
		const { id } = jwt.verify(token, process.env.JWT);
		const user = await this.findByPk(id, { include: [conn.models.address] });
		if (user) {
			return user;
		}
		throw 'user not found';
	} catch (ex) {
		const error = new Error('bad credentials');
		error.status = 401;
		throw error;
	}
};

User.prototype.generateToken = function () {
	return jwt.sign({ id: this.id }, JWT);
};

User.authenticate = async function ({ username, password }) {
	const user = await this.findOne({
		where: {
			username,
		},
	});
	if (user && (await bcrypt.compare(password, user.password))) {
		return jwt.sign({ id: user.id }, JWT);
	}
	const error = new Error('bad credentials');
	error.status = 401;
	throw error;
};

User.prototype.cartAddress = async function ({ address }) {
	const cart = await this.getCart();
	cart.addressId = address.id;
	await cart.save();
	return this.getCart();
};

module.exports = User;
