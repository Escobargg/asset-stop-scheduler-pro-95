-- Create enum types
CREATE TYPE public.phase_type AS ENUM ('PORTO', 'MINA', 'USINA', 'PELOTIZAÇÃO', 'FERROVIA');
CREATE TYPE public.priority_type AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.frequency_unit AS ENUM ('days', 'weeks', 'months', 'years');
CREATE TYPE public.duration_unit AS ENUM ('hours', 'days');
CREATE TYPE public.stop_status AS ENUM ('planned', 'in-progress', 'completed', 'cancelled');

-- Create location_centers table
CREATE TABLE public.location_centers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phase phase_type NOT NULL,
    process TEXT,
    corridor TEXT,
    executive_directorate TEXT NOT NULL,
    executive_management TEXT NOT NULL,
    plant_code TEXT,
    maintenance_plant TEXT,
    planner_group TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assets table
CREATE TABLE public.assets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tag TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location_center_id UUID REFERENCES public.location_centers(id) ON DELETE CASCADE,
    phase phase_type NOT NULL,
    system TEXT NOT NULL,
    category TEXT NOT NULL,
    executive_directorate TEXT NOT NULL,
    executive_management TEXT NOT NULL,
    group_id UUID,
    plant_code TEXT,
    work_center TEXT,
    functional_location TEXT,
    sap_id TEXT,
    client_id TEXT,
    created_by TEXT,
    modified_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create asset_groups table
CREATE TABLE public.asset_groups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location_center_id UUID REFERENCES public.location_centers(id) ON DELETE CASCADE,
    phase phase_type NOT NULL,
    system TEXT NOT NULL,
    category TEXT NOT NULL,
    executive_directorate TEXT NOT NULL,
    executive_management TEXT NOT NULL,
    plant_code TEXT,
    maintenance_plant TEXT,
    planner_group TEXT,
    sap_id TEXT,
    client_id TEXT,
    created_by TEXT,
    modified_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create maintenance_strategies table
CREATE TABLE public.maintenance_strategies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    group_id UUID REFERENCES public.asset_groups(id) ON DELETE CASCADE NOT NULL,
    frequency_value INTEGER NOT NULL,
    frequency_unit frequency_unit NOT NULL,
    duration_value INTEGER NOT NULL,
    duration_unit duration_unit NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    priority priority_type NOT NULL DEFAULT 'medium',
    teams TEXT[],
    total_hours INTEGER,
    completion_percentage INTEGER DEFAULT 0,
    sap_strategy_id TEXT,
    maintenance_package TEXT,
    task_list_id TEXT,
    sap_id TEXT,
    client_id TEXT,
    created_by TEXT,
    modified_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create maintenance_stops table
CREATE TABLE public.maintenance_stops (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.asset_groups(id) ON DELETE CASCADE NOT NULL,
    strategy_id UUID REFERENCES public.maintenance_strategies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL, -- deprecated field
    end_date TIMESTAMP WITH TIME ZONE NOT NULL, -- deprecated field
    planned_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    planned_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_date TIMESTAMP WITH TIME ZONE,
    actual_end_date TIMESTAMP WITH TIME ZONE,
    duration INTEGER NOT NULL, -- em horas
    status stop_status NOT NULL DEFAULT 'planned',
    priority priority_type NOT NULL DEFAULT 'medium',
    affected_assets UUID[] NOT NULL,
    responsible_team TEXT NOT NULL,
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    work_order_id TEXT,
    notification_id TEXT,
    cost_center TEXT,
    sap_id TEXT,
    client_id TEXT,
    created_by TEXT,
    modified_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint for assets group_id
ALTER TABLE public.assets 
ADD CONSTRAINT fk_assets_group_id 
FOREIGN KEY (group_id) REFERENCES public.asset_groups(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_assets_location_center ON public.assets(location_center_id);
CREATE INDEX idx_assets_phase ON public.assets(phase);
CREATE INDEX idx_assets_group_id ON public.assets(group_id);
CREATE INDEX idx_asset_groups_location_center ON public.asset_groups(location_center_id);
CREATE INDEX idx_maintenance_strategies_group_id ON public.maintenance_strategies(group_id);
CREATE INDEX idx_maintenance_stops_group_id ON public.maintenance_stops(group_id);
CREATE INDEX idx_maintenance_stops_strategy_id ON public.maintenance_stops(strategy_id);
CREATE INDEX idx_maintenance_stops_planned_dates ON public.maintenance_stops(planned_start_date, planned_end_date);

-- Enable Row Level Security
ALTER TABLE public.location_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_stops ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - adjust based on authentication needs)
CREATE POLICY "Enable all operations for location_centers" ON public.location_centers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for assets" ON public.assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for asset_groups" ON public.asset_groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for maintenance_strategies" ON public.maintenance_strategies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for maintenance_stops" ON public.maintenance_stops FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_location_centers_updated_at
    BEFORE UPDATE ON public.location_centers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_asset_groups_updated_at
    BEFORE UPDATE ON public.asset_groups
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_strategies_updated_at
    BEFORE UPDATE ON public.maintenance_strategies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_stops_updated_at
    BEFORE UPDATE ON public.maintenance_stops
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();