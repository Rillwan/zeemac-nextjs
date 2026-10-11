import {
  Ship, Droplet, Fuel, Wind, Gauge, Waves, Fan, Factory, Anchor, HardHat,
  Zap, Cog, Truck, Layers, Award, Target, ShieldCheck, MapPin, MessageSquare,
  PackageSearch, Settings, Users, Globe, CheckCircle, Star, Box, Wrench, Filter
} from 'lucide-react';

// A curated set of icons admins can pick from — keeps the DB storing a
// plain string (icon name) instead of a component, while the site still
// renders real lucide-react icons by looking the name up here.
export const ICON_MAP = {
  Ship, Droplet, Fuel, Wind, Gauge, Waves, Fan, Factory, Anchor, HardHat,
  Zap, Cog, Truck, Layers, Award, Target, ShieldCheck, MapPin, MessageSquare,
  PackageSearch, Settings, Users, Globe, CheckCircle, Star, Box, Wrench, Filter
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);