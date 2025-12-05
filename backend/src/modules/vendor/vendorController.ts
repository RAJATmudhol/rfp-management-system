import { Request, Response } from 'express';
import {db} from '../../model';

export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await db.Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
};

export const getVendors = async (_req: Request, res: Response) => {
  try {
    const vendors = await db.Vendor.findAll();
    res.status(201).json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};
