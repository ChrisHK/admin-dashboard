import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Alert,
    Typography,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        brand: '',
        model: '',
        sn: '',
        cpu: '',
        ram: '',
        storage: '',
        video_card: '',
        battery: 0,
        os: '',
        touch: false,
        noted: ''
    });

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            setError('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpen = (product = null) => {
        if (product) {
            setEditProduct(product);
            setFormData({
                date: product.date,
                brand: product.brand,
                model: product.model,
                sn: product.sn,
                cpu: product.cpu,
                ram: product.ram,
                storage: product.storage,
                video_card: product.video_card,
                battery: product.battery,
                os: product.os,
                touch: product.touch,
                noted: product.noted
            });
        } else {
            setEditProduct(null);
            setFormData({
                date: '',
                brand: '',
                model: '',
                sn: '',
                cpu: '',
                ram: '',
                storage: '',
                video_card: '',
                battery: 0,
                os: '',
                touch: false,
                noted: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);
        setFormData({
            date: '',
            brand: '',
            model: '',
            sn: '',
            cpu: '',
            ram: '',
            storage: '',
            video_card: '',
            battery: 0,
            os: '',
            touch: false,
            noted: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editProduct) {
                await axios.put(`http://localhost:3000/products/${editProduct.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:3000/products', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            handleClose();
            fetchProducts();
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (error) {
            setError('Failed to delete product');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Products</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Product
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer 
                component={Paper}
                sx={{ 
                    maxHeight: 'calc(100vh - 200px)',
                    overflow: 'auto'
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Brand</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>SN</TableCell>
                            <TableCell>CPU</TableCell>
                            <TableCell>RAM</TableCell>
                            <TableCell>Storage</TableCell>
                            <TableCell>Video Card</TableCell>
                            <TableCell>Battery</TableCell>
                            <TableCell>OS</TableCell>
                            <TableCell>Touch</TableCell>
                            <TableCell>Noted</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow 
                                key={product.id}
                                hover
                            >
                                <TableCell>{new Date(product.date).toLocaleDateString()}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.model}</TableCell>
                                <TableCell>{product.sn}</TableCell>
                                <TableCell>{product.cpu}</TableCell>
                                <TableCell>{product.ram}</TableCell>
                                <TableCell>{product.storage}</TableCell>
                                <TableCell>{product.video_card || '-'}</TableCell>
                                <TableCell>{product.battery}%</TableCell>
                                <TableCell>{product.os}</TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={product.touch}
                                        disabled
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{product.noted || '-'}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleOpen(product)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editProduct ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            type="date"
                            label="Date"
                            value={formData.date}
                            onChange={(e) => setFormData({
                                ...formData,
                                date: e.target.value
                            })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Brand"
                            value={formData.brand}
                            onChange={(e) => setFormData({
                                ...formData,
                                brand: e.target.value
                            })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Model"
                            value={formData.model}
                            onChange={(e) => setFormData({
                                ...formData,
                                model: e.target.value
                            })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="SN"
                            value={formData.sn}
                            onChange={(e) => setFormData({
                                ...formData,
                                sn: e.target.value
                            })}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="CPU"
                            value={formData.cpu}
                            onChange={(e) => setFormData({
                                ...formData,
                                cpu: e.target.value
                            })}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="RAM"
                            value={formData.ram}
                            onChange={(e) => setFormData({
                                ...formData,
                                ram: e.target.value
                            })}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Storage"
                            value={formData.storage}
                            onChange={(e) => setFormData({
                                ...formData,
                                storage: e.target.value
                            })}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Video Card"
                            value={formData.video_card}
                            onChange={(e) => setFormData({
                                ...formData,
                                video_card: e.target.value
                            })}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            type="number"
                            label="Battery (%)"
                            value={formData.battery}
                            onChange={(e) => setFormData({
                                ...formData,
                                battery: parseInt(e.target.value)
                            })}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="OS"
                            value={formData.os}
                            onChange={(e) => setFormData({
                                ...formData,
                                os: e.target.value
                            })}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.touch}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        touch: e.target.checked
                                    })}
                                />
                            }
                            label="Touch Screen"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Notes"
                            value={formData.noted}
                            onChange={(e) => setFormData({
                                ...formData,
                                noted: e.target.value
                            })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editProduct ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Products; 