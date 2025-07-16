/**
 * SAP BTP Configuration Service
 * Handles SAP Business Technology Platform integration and configuration
 */

export interface SAPBTPConfig {
  /** SAP Cloud Foundry API endpoint */
  cfApiEndpoint?: string;
  /** SAP Identity Authentication Service */
  iasEndpoint?: string;
  /** SAP Destination Service */
  destinationService?: string;
  /** Application router URL */
  appRouterUrl?: string;
  /** Client ID for XSUAA */
  clientId?: string;
  /** Tenant subdomain */
  tenantSubdomain?: string;
  /** SAP S/4HANA Cloud endpoint */
  s4HanaEndpoint?: string;
}

export interface SAPIntegrationHeaders {
  'Content-Type': string;
  'Accept': string;
  'Authorization'?: string;
  'X-CSRF-Token'?: string;
  'SAP-Client'?: string;
}

export class SAPBTPService {
  private config: SAPBTPConfig;
  
  constructor(config: SAPBTPConfig = {}) {
    // Use config defaults instead of environment variables for browser compatibility
    this.config = {
      cfApiEndpoint: '',
      iasEndpoint: '',
      destinationService: '',
      appRouterUrl: '',
      clientId: '',
      tenantSubdomain: '',
      s4HanaEndpoint: '',
      ...config
    };
  }

  /**
   * Get standard SAP headers for API calls
   */
  getStandardHeaders(additionalHeaders: Partial<SAPIntegrationHeaders> = {}): SAPIntegrationHeaders {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'SAP-Client': '100', // Default client
      ...additionalHeaders
    };
  }

  /**
   * Format data according to SAP naming conventions
   */
  formatForSAP<T extends Record<string, any>>(data: T): Record<string, any> {
    const formatted: Record<string, any> = {};
    
    Object.keys(data).forEach(key => {
      // Convert camelCase to SAP naming convention (PascalCase)
      const sapKey = key.charAt(0).toUpperCase() + key.slice(1);
      formatted[sapKey] = data[key];
    });

    return formatted;
  }

  /**
   * Format response from SAP to application format
   */
  formatFromSAP<T>(sapData: Record<string, any>): Partial<T> {
    const formatted: Record<string, any> = {};
    
    Object.keys(sapData).forEach(key => {
      // Convert PascalCase to camelCase
      const appKey = key.charAt(0).toLowerCase() + key.slice(1);
      formatted[appKey] = sapData[key];
    });

    return formatted as Partial<T>;
  }

  /**
   * Create SAP-compatible entity ID
   */
  generateSAPId(prefix: string = 'MAI', sequence: number): string {
    return `${prefix}${sequence.toString().padStart(10, '0')}`;
  }

  /**
   * Validate SAP entity structure
   */
  validateSAPEntity(entity: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entity.id) errors.push('Entity ID is required');
    if (!entity.createdAt) errors.push('Creation timestamp is required');
    if (!entity.updatedAt) errors.push('Update timestamp is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get configuration for current environment
   */
  getConfig(): SAPBTPConfig {
    return { ...this.config };
  }

  /**
   * Check if SAP BTP integration is configured
   */
  isConfigured(): boolean {
    return !!(this.config.s4HanaEndpoint || this.config.cfApiEndpoint);
  }

  /**
   * Create OData query parameters
   */
  createODataQuery(options: {
    select?: string[];
    filter?: string;
    expand?: string[];
    orderby?: string;
    top?: number;
    skip?: number;
  }): string {
    const params = new URLSearchParams();
    
    if (options.select?.length) {
      params.append('$select', options.select.join(','));
    }
    
    if (options.filter) {
      params.append('$filter', options.filter);
    }
    
    if (options.expand?.length) {
      params.append('$expand', options.expand.join(','));
    }
    
    if (options.orderby) {
      params.append('$orderby', options.orderby);
    }
    
    if (options.top !== undefined) {
      params.append('$top', options.top.toString());
    }
    
    if (options.skip !== undefined) {
      params.append('$skip', options.skip.toString());
    }
    
    return params.toString();
  }
}

// Singleton instance
export const sapBTPService = new SAPBTPService();

/**
 * Error handling for SAP BTP operations
 */
export class SAPBTPError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public sapErrorCode?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SAPBTPError';
  }
}

/**
 * SAP BTP Response wrapper
 */
export interface SAPBTPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: SAPBTPError;
  metadata?: {
    totalCount?: number;
    hasMore?: boolean;
    etag?: string;
  };
}

/**
 * Helper function to handle SAP BTP API responses
 */
export const handleSAPResponse = async <T>(
  response: Response
): Promise<SAPBTPResponse<T>> => {
  try {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new SAPBTPError(
        errorData.message || `SAP API Error: ${response.status}`,
        response.status,
        errorData.code,
        errorData
      );
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
      metadata: {
        etag: response.headers.get('etag') || undefined,
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof SAPBTPError ? error : new SAPBTPError(
        error instanceof Error ? error.message : 'Unknown SAP BTP error'
      )
    };
  }
};