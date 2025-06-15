import React, { useMemo } from 'react';
import { Handle, HandleProps, useNodeConnections } from '@xyflow/react';

const CustomHandle = (props: HandleProps & { connectionCount: number }) => {
  const { connectionCount, ...rest } = props;
  const connections = useNodeConnections({
    handleType: props.type,
  });
  const isConnectable = useMemo(
    () => connections.length < connectionCount,
    [connections, connectionCount],
  );

  return (
    <Handle
      {...rest}
      style={{
        ...rest.style,
        border: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      isConnectable={isConnectable}
    />
  );
};

export default CustomHandle;
