export async function checkPasswordBreach(password) {
  if (!password) return 0;

  try {

    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

  
    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    
    const apiUrl = process.env.NEXT_PUBLIC_HIBP_API || 'https://api.pwnedpasswords.com/range/';
    const response = await fetch(`${apiUrl}${prefix}`);
    
    if (!response.ok) throw new Error('Failed to fetch breach data');

    const text = await response.text();
    const matches = text.split('\r\n');

    
    for (let match of matches) {
      const [hashSuffix, count] = match.split(':');
      if (hashSuffix === suffix) {
        return parseInt(count, 10); 
      }
    }

    return 0; 
  } catch (error) {
    console.error('Breach check error:', error);
    return 0; 
  }
}