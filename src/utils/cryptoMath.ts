import { DHParameters, DHCalculationResult, StepInfo, SimulationStep } from '../types/crypto';

/**
 * Fast Modular Exponentiation using BigInt: (base^exp) % mod
 */
export function modPow(base: number | bigint, exp: number | bigint, mod: number | bigint): number {
  const m = BigInt(mod);
  // Guard against division/modulo by zero or non-positive modulos
  if (m <= 1n) return 0;

  let b = BigInt(base);
  let e = BigInt(exp);
  if (e < 0n) return 0;

  let result = 1n;
  b = b % m;

  while (e > 0n) {
    if (e % 2n === 1n) {
      result = (result * b) % m;
    }
    e = e / 2n;
    b = (b * b) % m;
  }

  return Number(result);
}

/**
 * Primality check for integer numbers
 */
export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Prime factorization of n
 */
export function getPrimeFactors(n: number): number[] {
  if (n <= 1) return [];
  const factors: Set<number> = new Set();
  let d = 2;
  let num = n;
  while (d * d <= num) {
    if (num % d === 0) {
      factors.add(d);
      while (num % d === 0) {
        num /= d;
      }
    }
    d++;
  }
  if (num > 1) {
    factors.add(num);
  }
  return Array.from(factors);
}

/**
 * Check if g is a primitive root modulo p
 */
export function isPrimitiveRoot(g: number, p: number): boolean {
  if (p <= 2 || g <= 1 || g >= p) return false;
  if (!isPrime(p)) return false;

  const phi = p - 1;
  const factors = getPrimeFactors(phi);
  if (factors.length === 0) return false;

  for (const factor of factors) {
    if (modPow(g, phi / factor, p) === 1) {
      return false;
    }
  }
  return true;
}

/**
 * Find up to `limit` primitive roots for p
 */
export function findPrimitiveRoots(p: number, limit = 5): number[] {
  if (p <= 2 || !isPrime(p)) return [];
  const roots: number[] = [];
  for (let g = 2; g < p; g++) {
    if (isPrimitiveRoot(g, p)) {
      roots.push(g);
      if (roots.length >= limit) break;
    }
  }
  return roots;
}

/**
 * Calculate the complete Diffie-Hellman lifecycle
 */
export function computeDH(params: DHParameters): DHCalculationResult {
  const p = Math.max(0, Number(params.p) || 0);
  const g = Math.max(0, Number(params.g) || 0);
  const a = Math.max(0, Number(params.a) || 0);
  const b = Math.max(0, Number(params.b) || 0);

  // If parameters are invalid or empty
  const isValid = p >= 2 && g >= 1 && a >= 1 && b >= 1;

  if (!isValid) {
    return {
      p,
      g,
      a,
      b,
      A: 0,
      B: 0,
      sA: 0,
      sB: 0,
      isSuccess: false,
      intermediateSteps: {
        aPublicPower: 0n,
        bPublicPower: 0n,
        aSharedPower: 0n,
        bSharedPower: 0n,
      },
    };
  }

  // A computes public key: A = g^a mod p
  const A = modPow(g, a, p);
  // B computes public key: B = g^b mod p
  const B = modPow(g, b, p);

  // A computes shared secret: s = B^a mod p
  const sA = modPow(B, a, p);
  // B computes shared secret: s = A^b mod p
  const sB = modPow(A, b, p);

  // Power values for display with safe exponent clamping
  const safeAExp = BigInt(Math.max(0, Math.min(a, 30)));
  const safeBExp = BigInt(Math.max(0, Math.min(b, 30)));
  const aPublicPower = BigInt(g) ** safeAExp;
  const bPublicPower = BigInt(g) ** safeBExp;
  const aSharedPower = BigInt(B) ** safeAExp;
  const bSharedPower = BigInt(A) ** safeBExp;

  return {
    p,
    g,
    a,
    b,
    A,
    B,
    sA,
    sB,
    isSuccess: sA === sB && sA > 0,
    intermediateSteps: {
      aPublicPower,
      bPublicPower,
      aSharedPower,
      bSharedPower,
    },
  };
}

/**
 * Build dynamic Vietnamese step metadata based on current parameters and results
 */
export function getStepInfo(step: number, params: DHParameters, result: DHCalculationResult): StepInfo {
  const p = Math.max(0, Number(params.p) || 0);
  const g = Math.max(0, Number(params.g) || 0);
  const a = Math.max(0, Number(params.a) || 0);
  const b = Math.max(0, Number(params.b) || 0);
  const { A, B, sA, sB } = result;

  const validStep = (Math.max(1, Math.min(5, step)) as SimulationStep);

  if (p < 2) {
    return {
      step: validStep,
      title: 'Đang chờ nhập Modulo (p)',
      subtitle: 'Vui lòng nhập số nguyên tố Modulo p (ví dụ: 23, 97...)',
      description:
        'Để giải thuật Diffie-Hellman có thể vận hành, cần một số nguyên tố Modulo p ≥ 3 làm không gian hữu hạn cho các phép tính lũy thừa một chiều.',
      mathFormulaA: `p = [Chưa nhập], g = ${g || '?'}, a = ${a || '?'}`,
      mathFormulaB: `p = [Chưa nhập], g = ${g || '?'}, b = ${b || '?'}`,
      mathCalculationA: 'Chưa có modulo p để thực hiện phép tính mod p',
      mathCalculationB: 'Chưa có modulo p để thực hiện phép tính mod p',
      securityNote: 'Modulo p phải là số nguyên tố để đảm bảo không gian khóa an toàn.',
      activeEntity: 'both',
    };
  }

  switch (validStep) {
    case 1:
      return {
        step: 1,
        title: 'Bước 1: Thống nhất tham số công khai',
        subtitle: 'Bên A và Bên B chọn chung Modulo (p) và Cơ số (g)',
        description:
          'Hai bên công khai thỏa thuận số nguyên tố modulo p và cơ số g (căn nguyên thủy). Tham số này được truyền công khai qua mạng, bất kỳ ai (kể cả Kẻ nghe lén) đều có thể nhìn thấy.',
        mathFormulaA: `p = ${p}, g = ${g}`,
        mathFormulaB: `p = ${p}, g = ${g}`,
        mathCalculationA: `Bên A lưu: Modulo p = ${p}, Cơ số g = ${g}`,
        mathCalculationB: `Bên B lưu: Modulo p = ${p}, Cơ số g = ${g}`,
        securityNote: 'Công khai hoàn toàn. Kẻ nghe lén biết p và g nhưng không thể suy ra khóa bí mật trong tương lai.',
        activeEntity: 'both',
      };
    case 2:
      return {
        step: 2,
        title: 'Bước 2: Tạo số mũ bí mật riêng tư',
        subtitle: 'Bên A chọn bí mật a, Bên B chọn bí mật b',
        description:
          'Bên A bí mật chọn một số mũ ngẫu nhiên a. Bên B độc lập chọn số mũ bí mật b. Cả hai số này KHÔNG BAO GIỜ được gửi qua mạng hay tiết lộ cho bất kỳ ai!',
        mathFormulaA: `a = ${a} (Khóa riêng của A)`,
        mathFormulaB: `b = ${b} (Khóa riêng của B)`,
        mathCalculationA: `Bên A giữ bí mật tại chỗ: a = ${a}`,
        mathCalculationB: `Bên B giữ bí mật tại chỗ: b = ${b}`,
        securityNote: 'Tuyệt mật! a và b được lưu an toàn tại máy trạm cục bộ của mỗi bên.',
        activeEntity: 'both',
      };
    case 3:
      return {
        step: 3,
        title: 'Bước 3: Tính toán khóa công khai',
        subtitle: 'Áp dụng phép lũy thừa modulo: A = gᵃ mod p, B = gᵇ mod p',
        description:
          'Mỗi bên tự tính toán khóa công khai của mình bằng phép lũy thừa theo modulo. Phép tính này rất dễ tính theo chiều xuôi, nhưng cực kỳ khó tính ngược lại (Bài toán Lôgarit rời rạc).',
        mathFormulaA: `A = gᵃ mod p = ${g}^${a} mod ${p}`,
        mathFormulaB: `B = gᵇ mod p = ${g}^${b} mod ${p}`,
        mathCalculationA: `${g}^${a} mod ${p} = ${A}`,
        mathCalculationB: `${g}^${b} mod ${p} = ${B}`,
        securityNote: `Bên A thu được khóa công khai A = ${A}. Bên B thu được khóa công khai B = ${B}.`,
        activeEntity: 'both',
      };
    case 4:
      return {
        step: 4,
        title: 'Bước 4: Trao đổi khóa qua kênh truyền công khai',
        subtitle: 'Bên A gửi A cho Bên B, Bên B gửi B cho Bên A',
        description:
          'Bên A gửi khóa công khai A qua mạng đến Bên B. Đồng thời, Bên B gửi khóa công khai B đến Bên A. Kẻ nghe lén bắt được cả A và B trên đường truyền nhưng không thể tìm ra a hoặc b!',
        mathFormulaA: `Gửi A = ${A} ➔ B | Nhận B = ${B} từ B`,
        mathFormulaB: `Gửi B = ${B} ➔ A | Nhận A = ${A} từ A`,
        mathCalculationA: `Bên A nhận B = ${B} và sẵn sàng tính khóa chung`,
        mathCalculationB: `Bên B nhận A = ${A} và sẵn sàng tính khóa chung`,
        securityNote: `Kẻ nghe lén trên đường truyền ghi nhận: p=${p}, g=${g}, A=${A}, B=${B}, nhưng không thể đảo ngược để tìm a hoặc b.`,
        activeEntity: 'channel',
      };
    case 5:
    default:
      return {
        step: 5,
        title: 'Bước 5: Thiết lập khóa bí mật chung',
        subtitle: 'Bên A tính s = Bᵃ mod p, Bên B tính s = Aᵇ mod p',
        description:
          'Phép màu toán học xảy ra: Bên A lấy khóa B vừa nhận mũ a mod p. Bên B lấy khóa A vừa nhận mũ b mod p. Cả hai đều thu được cùng một giá trị s = g^(ab) mod p mà không cần gửi s qua mạng!',
        mathFormulaA: `s = Bᵃ mod p = ${B}^${a} mod ${p}`,
        mathFormulaB: `s = Aᵇ mod p = ${A}^${b} mod ${p}`,
        mathCalculationA: `${B}^${a} mod ${p} = ${sA}`,
        mathCalculationB: `${A}^${b} mod ${p} = ${sB}`,
        securityNote: `Thành công! Khóa bí mật chung đối xứng s = ${sA} đã được thiết lập hoàn hảo. Kênh trao đổi được bảo mật 100%.`,
        activeEntity: 'shared',
      };
  }
}
